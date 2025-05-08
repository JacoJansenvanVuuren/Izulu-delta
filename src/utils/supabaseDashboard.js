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
export async function addMonthlyClient(monthIndex, year, client) {
  const table = getMonthlyTableName(monthIndex);
  const { data, error } = await supabase
    .from(table)
    .insert([{ ...client, year }])
    .select();
  if (error) throw new Error(error.message);
  return data?.[0];
}

// Update a row in a monthly table
export async function updateMonthlyClient(monthIndex, year, id, updates) {
  const table = getMonthlyTableName(monthIndex);
  const { data, error } = await supabase
    .from(table)
    .update(updates)
    .eq('id', id)
    .eq('year', year)
    .select();
  if (error) throw new Error(error.message);
  return data?.[0];
}

// Delete a row in a monthly table
export async function deleteMonthlyClient(monthIndex, year, id) {
  const table = getMonthlyTableName(monthIndex);
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id)
    .eq('year', year);
  if (error) throw new Error(error.message);
  return true;
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
  const { data, error } = await supabase
    .from('clients')
    .insert([client])
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

export async function deleteClient(id) {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);
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
