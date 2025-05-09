
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

// Helper to map camelCase client fields to all-lowercase, no-underscore
function mapClientForDb(client) {
  const dbClient = { ...client };
  
  // Explicitly map only known, existing columns
  const existingColumns = [
    'deductiondate', 'policiescount', 'scheduledocsurl', 
    'pdfdocsurl', 'policynumbers', 'issuedate', 
    'loadocurl', 'policypremium', 'name', 'location', 
    'products', 'year', 'client_id', 'created_at'
  ];

  // Filter out any keys not in existing columns
  Object.keys(dbClient).forEach(key => {
    // Convert camelCase to snake_case for comparison
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    
    if (!existingColumns.includes(key) && !existingColumns.includes(snakeKey)) {
      delete dbClient[key];
    }
  });

  // Ensure critical fields are present and use snake_case
  const criticalFieldMap = {
    'deductionDate': 'deductiondate',
    'policiesCount': 'policiescount',
    'scheduleDocsUrl': 'scheduledocsurl',
    'pdfDocsUrl': 'pdfdocsurl',
    'policyNumbers': 'policynumbers',
    'issueDate': 'issuedate',
    'loaDocUrl': 'loadocurl',
    'policyPremium': 'policypremium'
  };

  // Apply field mappings
  Object.entries(criticalFieldMap).forEach(([camelCase, snakeCase]) => {
    if (client[camelCase] !== undefined) {
      dbClient[snakeCase] = client[camelCase];
    }
  });

  // Conditionally handle ID
  if (dbClient.id === undefined || dbClient.id === null || 
      (typeof dbClient.id === 'string' && dbClient.id.startsWith('temp_'))) {
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
  
  console.log('Update Request:', {
    table,
    id,
    year,
    updates: JSON.stringify(updates)
  });

  // First, fetch the existing record to preserve critical fields
  const { data: existingRecord, error: fetchError } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .eq('year', year)
    .single();
  
  if (fetchError) {
    console.error('Error fetching existing record:', fetchError);
    throw new Error(fetchError.message);
  }

  console.log('Existing Record:', JSON.stringify(existingRecord));

  // Prepare updates, preserving existing values for critical fields
  const safeUpdates = { ...existingRecord };

  // Mapping of fields with potential camelCase/snake_case variations
  const fieldMappings = {
    'policiescount': ['policiesCount', 'policiescount'],
    'policypremium': ['policyPremium', 'policypremium'],
    'policynumbers': ['policyNumbers', 'policynumbers'],
    'scheduledocsurl': ['scheduleDocsUrl', 'scheduledocsurl'],
    'pdfdocsurl': ['pdfDocsUrl', 'pdfdocsurl'],
    'deductiondate': ['deductionDate', 'deductiondate'],
    'issuedate': ['issueDate', 'issuedate'],
    'loadocurl': ['loaDocUrl', 'loadocurl']
  };

  // Allowed fields to update
  const updateableFields = [
    'name', 'location', 'products', 'deductiondate', 
    'scheduledocsurl', 'pdfdocsurl', 'policynumbers', 
    'issuedate', 'loadocurl', 'policypremium', 'client_id'
  ];

  // Update only specific fields, preserving others
  updateableFields.forEach(field => {
    if (updates[field] !== undefined) {
      safeUpdates[field] = updates[field];
    }
  });

  // Special handling for fields with potential case variations
  Object.entries(fieldMappings).forEach(([snakeCaseField, variations]) => {
    const [camelCaseField, altSnakeCaseField] = variations;
    
    // Prioritize updates first, then existing record
    const fieldValue = updates[camelCaseField] !== undefined 
      ? updates[camelCaseField] 
      : (updates[altSnakeCaseField] !== undefined 
        ? updates[altSnakeCaseField] 
        : (existingRecord[snakeCaseField] || (snakeCaseField.includes('count') ? 0 : '')));

    safeUpdates[snakeCaseField] = fieldValue;
  });

  // Ensure year is set correctly
  safeUpdates.year = year;
  
  console.log('Safe Updates:', JSON.stringify(safeUpdates));

  const { data, error } = await supabase
    .from(table)
    .update(safeUpdates)
    .eq('id', id)
    .eq('year', year)
    .select();
  
  if (error) {
    console.error('Error updating record:', error);
    throw new Error(error.message);
  }
  
  console.log('Update Result:', JSON.stringify(data));

  // Ensure the returned data matches the updates
  const updatedRecord = data?.[0];
  if (updatedRecord) {
    // Verify critical fields are preserved
    Object.entries(fieldMappings).forEach(([snakeCaseField, variations]) => {
      const [camelCaseField] = variations;
      if (updates[camelCaseField] !== undefined && 
          updatedRecord[snakeCaseField] !== updates[camelCaseField]) {
        console.warn(`Field ${snakeCaseField} not updated correctly`);
      }
    });
  }

  // Also update in the global clients table
  await updateGlobalClientFromMonthly({...updates, name: updates.name});
  
  return updatedRecord;
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
export async function updateGlobalClientFromMonthly(monthlyClient) {
  // Ensure we have a name to work with
  if (!monthlyClient.name) {
    console.warn('No name provided for global client update');
    return null;
  }

  try {
    // Fetch all monthly data for this client across all months
    const allMonthlyData = await getAllMonthlyDataForClient(monthlyClient.name);

    // Aggregate data from all months
    const aggregatedData = aggregateClientData(allMonthlyData.data);

    // Prepare update data with aggregated information
    const updateData = {
      name: monthlyClient.name,
      location: aggregatedData.location || monthlyClient.location || '',
      policy_premium: aggregatedData.policy_premium || monthlyClient.policyPremium || '',
      policies_count: aggregatedData.policies_count || monthlyClient.policiesCount || 0,
      products: aggregatedData.products || monthlyClient.products || [],
      policy_numbers: aggregatedData.policy_numbers || monthlyClient.policyNumbers || [],
    };

    // First, check if the client exists in the global clients table
    const { data: existingClients, error: fetchError } = await supabase
      .from('clients')
      .select('*')
      .eq('name', monthlyClient.name)
      .limit(1);

    if (fetchError) {
      console.error('Error fetching global client:', fetchError);
      return null;
    }

    let result;
    if (existingClients && existingClients.length > 0) {
      // Update existing client with aggregated data
      const { data, error } = await supabase
        .from('clients')
        .update(updateData)
        .eq('name', monthlyClient.name)
        .select();

      if (error) {
        console.error('Error updating global client:', error);
        return null;
      }

      result = data?.[0];
    } else {
      // Create new global client with aggregated data
      const { data, error } = await supabase
        .from('clients')
        .insert(updateData)
        .select();

      if (error) {
        console.error('Error creating global client:', error);
        return null;
      }

      result = data?.[0];
    }

    return result;
  } catch (err) {
    console.error('Unexpected error in updateGlobalClientFromMonthly:', err);
    return null;
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
  
  // Initialize result with comprehensive fields
  const result = {
    location: latestRecord.location || '',
    products: new Set(),
    policies_count: 0,
    policy_numbers: new Set(),
    policy_premium: 0,
    deduction_dates: new Set(),
    issue_dates: new Set(),
    schedule_docs_urls: new Set(),
    pdf_docs_urls: new Set(),
    loa_doc_urls: new Set()
  };
  
  // Aggregate data from all records
  monthlyData.forEach(record => {
    // Aggregate numerical values
    result.policies_count += (record.policiescount || 0);
    
    // Combine products
    if (record.products) {
      const products = Array.isArray(record.products) ? record.products : [];
      products.forEach(product => result.products.add(product));
    }
    
    // Combine policy numbers
    if (record.policynumbers) {
      const policyNumbers = Array.isArray(record.policynumbers) ? record.policynumbers : [];
      policyNumbers.forEach(number => result.policy_numbers.add(number));
    }
    
    // Sum up policy premium
    if (record.policypremium) {
      const premiumStr = String(record.policypremium).replace(/[^0-9.]/g, '');
      const premium = parseFloat(premiumStr);
      if (!isNaN(premium)) {
        result.policy_premium += premium;
      }
    }
    
    // Collect additional metadata
    if (record.deductiondate) result.deduction_dates.add(record.deductiondate);
    if (record.issuedate) result.issue_dates.add(record.issuedate);
    if (record.scheduledocsurl) {
      const urls = Array.isArray(record.scheduledocsurl) ? record.scheduledocsurl : [record.scheduledocsurl];
      urls.forEach(url => result.schedule_docs_urls.add(url));
    }
    if (record.pdfdocsurl) {
      const urls = Array.isArray(record.pdfdocsurl) ? record.pdfdocsurl : [record.pdfdocsurl];
      urls.forEach(url => result.pdf_docs_urls.add(url));
    }
    if (record.loadocurl) result.loa_doc_urls.add(record.loadocurl);
  });
  
  // Convert Sets to arrays for storage
  return {
    ...result,
    products: Array.from(result.products),
    policy_numbers: Array.from(result.policy_numbers),
    deduction_dates: Array.from(result.deduction_dates),
    issue_dates: Array.from(result.issue_dates),
    schedule_docs_urls: Array.from(result.schedule_docs_urls),
    pdf_docs_urls: Array.from(result.pdf_docs_urls),
    loa_doc_urls: Array.from(result.loa_doc_urls)
  };
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

// Delete client from all tables (both global and all monthly tables)
export async function deleteClient(name) {
  if (!name) throw new Error("Client name is required");
  
  // First delete all monthly records for this client
  const months = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  
  // Delete from all monthly tables in parallel for efficiency
  const deletePromises = months.map(month => 
    supabase
      .from(`clients_${month}`)
      .delete()
      .eq('name', name)
  );
  
  // Execute all delete operations
  await Promise.all(deletePromises);
  
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
  // Create path components first - fix for storage permissions
  const pathParts = path.split('/');
  if (pathParts.length > 1) {
    try {
      // Check if folder exists first to avoid errors
      const { data: existingFolder } = await supabase.storage
        .from('pdfs')
        .list(pathParts[0]);
      
      if (!existingFolder || existingFolder.length === 0) {
        // Create an empty file to initialize the folder
        await supabase.storage
          .from('pdfs')
          .upload(`${pathParts[0]}/.folder`, new Blob(['']));
      }
    } catch (error) {
      console.error("Error checking/creating folder:", error);
      // Continue anyway as the main upload might work
    }
  }

  const { data, error } = await supabase.storage
    .from('pdfs')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true // Changed to true to overwrite existing files with same name
    });

  if (error) {
    console.error("PDF upload error:", error);
    throw new Error(error.message);
  }
  
  return supabase.storage.from('pdfs').getPublicUrl(path).data.publicUrl;
}
