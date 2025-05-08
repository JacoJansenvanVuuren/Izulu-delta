import { supabase } from '../supabase';

// Helper to get table name for a month and year (e.g. 'clients_january')
export function getMonthlyTableName(monthIndex) {
  const months = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  return `clients_${months[monthIndex]}`;
}

// Fetch all rows for a given month and year
export async function fetchMonthlyClients(monthIndex, year) {
  const table = getMonthlyTableName(monthIndex);
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('year', year)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

// Add a row to a monthly table
// Helper to map camelCase client fields to all-lowercase, no-underscore
function mapClientForDb(client) {
  const dbClient = {
    ...client,
    deductiondate: client.deductionDate || client.deductiondate,
    policiescount: client.policiesCount || client.policiescount,
    scheduledocsurl: client.scheduleDocsUrl || client.scheduledocsurl,
    pdfdocsurl: client.pdfDocsUrl || client.pdfdocsurl,
    policynumbers: client.policyNumbers || client.policynumbers,
    issuedate: client.issueDate || client.issuedate,
    loadocurl: client.loaDocUrl || client.loadocurl,
    policypremium: client.policyPremium || client.policypremium,
    // Add more mappings as needed
    name: client.name,
    location: client.location,
    products: client.products,
    year: client.year,
    client_id: client.client_id,
    created_at: client.created_at,
    // id will be conditionally added below
  };
  // Remove all camelCase properties that could cause schema errors
  delete dbClient.deductionDate;
  delete dbClient.policiesCount;
  delete dbClient.scheduleDocsUrl;
  delete dbClient.pdfDocsUrl;
  delete dbClient.policyNumbers;
  delete dbClient.issueDate;
  delete dbClient.loaDocUrl;
  delete dbClient.policyPremium;
  // Remove id unless it is defined and not null (prevents NOT NULL constraint errors)
  if (dbClient.id === undefined || dbClient.id === null) {
    delete dbClient.id;
  }
  return dbClient;
}

export async function addMonthlyClient(monthIndex, year, client) {
  const table = getMonthlyTableName(monthIndex);
  const dbClient = mapClientForDb(client);
  
  // Remove temporary ID if it exists
  if (dbClient.id && dbClient.id.startsWith('temp_')) {
    delete dbClient.id;
  }

  const { data, error } = await supabase
    .from(table)
    .insert([{ ...dbClient, year }])
    .select();
  if (error) throw new Error(error.message);
  
  // Also update/create in the global clients table based on name
  await updateGlobalClientFromMonthly(client);
  
  return data?.[0];
}

// Update a row in a monthly table
export async function updateMonthlyClient(monthIndex, year, id, updates) {
  const table = getMonthlyTableName(monthIndex);
  const dbUpdates = mapClientForDb(updates);
  const { data, error } = await supabase
    .from(table)
    .update(dbUpdates)
    .eq('id', id)
    .eq('year', year)
    .select();
  if (error) throw new Error(error.message);
  
  // Also update in the global clients table
  await updateGlobalClientFromMonthly(updates);
  
  return data?.[0];
}

// Delete a row in a monthly table
export async function deleteMonthlyClient(monthIndex, year, id) {
  const table = getMonthlyTableName(monthIndex);
  // First, get the client to be deleted to update global table
  const { data: clientData } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .eq('year', year)
    .single();
  
  // Delete from monthly table
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id)
    .eq('year', year);
  if (error) throw new Error(error.message);
  
  // Update global clients table to reflect the removal
  if (clientData) {
    await updateGlobalClientsAfterDelete(clientData.name);
  }
  
  return true;
}

// Helper function to update or create a client in the global clients table
async function updateGlobalClientFromMonthly(client) {
  if (!client.name) return;
  
  console.log('Updating global client from monthly:', client.name);
  
  // Check if client with this name already exists in global table
  const { data: existingClients } = await supabase
    .from('clients')
    .select('*')
    .eq('name', client.name);
  
  // Get all monthly data for this client to aggregate
  const { data: allMonthlyData } = await getAllMonthlyDataForClient(client.name);
  
  if (!allMonthlyData || allMonthlyData.length === 0) return;
  
  // Aggregate data from all months
  const aggregatedData = aggregateClientData(allMonthlyData);
  
  // Update or insert into global clients table
  if (existingClients && existingClients.length > 0) {
    console.log('Updating existing client in global table:', client.name);
    await supabase
      .from('clients')
      .update(aggregatedData)
      .eq('name', client.name);
  } else {
    console.log('Creating new client in global table:', client.name);
    await supabase
      .from('clients')
      .insert([{ 
        name: client.name,
        ...aggregatedData 
      }]);
  }
}

// Helper function to update global clients table after a monthly record is deleted
async function updateGlobalClientsAfterDelete(clientName) {
  // Get all remaining data for this client
  const { data: remainingData } = await getAllMonthlyDataForClient(clientName);
  
  if (!remainingData || remainingData.length === 0) {
    // If no data left, delete from global table
    await supabase
      .from('clients')
      .delete()
      .eq('name', clientName);
  } else {
    // Otherwise update with aggregated data from remaining months
    const aggregatedData = aggregateClientData(remainingData);
    await supabase
      .from('clients')
      .update(aggregatedData)
      .eq('name', clientName);
  }
}

// Helper to get all monthly data for a client
async function getAllMonthlyDataForClient(clientName) {
  const months = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  
  const allData = [];
  
  for (const month of months) {
    const { data } = await supabase
      .from(`clients_${month}`)
      .select('*')
      .eq('name', clientName);
    
    if (data && data.length > 0) {
      allData.push(...data);
    }
  }
  
  return { data: allData };
}

// Helper to aggregate client data across months
function aggregateClientData(monthlyData) {
  if (!monthlyData || monthlyData.length === 0) return {};
  
  // Start with data from the latest record for non-numerical fields
  const latestRecord = monthlyData.sort((a, b) => 
    new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  )[0];
  
  // Initialize with location from the latest record
  const result = {
    location: latestRecord.location,
    products: [],
    policies_count: 0,
    policy_numbers: [],
    policy_premium: 0,
  };
  
  // Aggregate numerical values and arrays
  monthlyData.forEach(record => {
    // Sum up policy count
    result.policies_count += (record.policiescount || 0);
    
    // Combine products without duplicates
    if (record.products) {
      const products = Array.isArray(record.products) ? record.products : [];
      products.forEach(product => {
        if (!result.products.includes(product)) {
          result.products.push(product);
        }
      });
    }
    
    // Combine policy numbers without duplicates
    if (record.policynumbers) {
      const policyNumbers = Array.isArray(record.policynumbers) ? record.policynumbers : [];
      policyNumbers.forEach(number => {
        if (!result.policy_numbers.includes(number)) {
          result.policy_numbers.push(number);
        }
      });
    }
    
    // Sum up policy premium (convert from string if needed)
    if (record.policypremium) {
      const premiumStr = String(record.policypremium).replace(/[^0-9.]/g, '');
      const premium = parseFloat(premiumStr);
      if (!isNaN(premium)) {
        result.policy_premium += premium;
      }
    }
  });
  
  return result;
}

// CRUD for global clients table
export async function fetchAllClients() {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function addClient(client) {
  const dbClient = mapClientForDb(client);
  const { data, error } = await supabase
    .from('clients')
    .insert([dbClient])
    .select();
  if (error) throw new Error(error.message);
  return data?.[0];
}

export async function updateClient(id, updates) {
  const { data, error } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) throw new Error(error.message);
  return data?.[0];
}

export async function deleteClient(name) {
  // First delete all monthly records for this client
  const months = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  
  for (const month of months) {
    await supabase
      .from(`clients_${month}`)
      .delete()
      .eq('name', name);
  }
  
  // Then delete from global table
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('name', name);
  if (error) throw new Error(error.message);
  return true;
}

// PDF upload helper
export async function uploadPdf(file, path) {
  const { data, error } = await supabase.storage.from('pdfs').upload(path, file, {
    cacheControl: '3600',
    upsert: false
  });
  if (error) throw new Error(error.message);
  return supabase.storage.from('pdfs').getPublicUrl(path).data.publicUrl;
}
