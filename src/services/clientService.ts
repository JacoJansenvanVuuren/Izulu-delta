import { supabase } from '@/integrations/supabase/client';
import { Client, ClientPolicy, PolicyProduct, PolicyNumber, ScheduleDoc, PdfDoc, LoaDoc, ClientData } from '@/types/clients';

// Client CRUD operations
export const getClients = async (): Promise<Client[]> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
  
  return data || [];
};

export const createClient = async (client: Omit<Client, 'id' | 'created_at'>): Promise<Client> => {
  const { data, error } = await supabase
    .from('clients')
    .insert(client)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating client:', error);
    throw error;
  }
  
  return data;
};

export const updateClient = async (id: string, updates: Partial<Client>): Promise<Client> => {
  const { data, error } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating client:', error);
    throw error;
  }
  
  return data;
};

export const deleteClient = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
};

// Client Policy operations
export const getClientPoliciesByMonth = async (month: number, year: number = new Date().getFullYear()): Promise<ClientPolicy[]> => {
  const { data, error } = await supabase
    .from('client_policies')
    .select('*')
    .eq('month', month)
    .eq('year', year);
  
  if (error) {
    console.error('Error fetching client policies:', error);
    throw error;
  }
  
  return data || [];
};

export const createClientPolicy = async (policy: Omit<ClientPolicy, 'id' | 'created_at'>): Promise<ClientPolicy> => {
  const { data, error } = await supabase
    .from('client_policies')
    .insert(policy)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating client policy:', error);
    throw error;
  }
  
  return data;
};

export const updateClientPolicy = async (id: string, updates: Partial<ClientPolicy>): Promise<ClientPolicy> => {
  const { data, error } = await supabase
    .from('client_policies')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating client policy:', error);
    throw error;
  }
  
  return data;
};

export const deleteClientPolicy = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('client_policies')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting client policy:', error);
    throw error;
  }
};

// Policy Products operations
export const getPolicyProducts = async (policyId: string): Promise<PolicyProduct[]> => {
  const { data, error } = await supabase
    .from('policy_products')
    .select('*')
    .eq('policy_id', policyId);
  
  if (error) {
    console.error('Error fetching policy products:', error);
    throw error;
  }
  
  return data || [];
};

export const createPolicyProduct = async (product: Omit<PolicyProduct, 'id'>): Promise<PolicyProduct> => {
  const { data, error } = await supabase
    .from('policy_products')
    .insert(product)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating policy product:', error);
    throw error;
  }
  
  return data;
};

export const deletePolicyProduct = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('policy_products')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting policy product:', error);
    throw error;
  }
};

// Policy Numbers operations
export const getPolicyNumbers = async (policyId: string): Promise<PolicyNumber[]> => {
  const { data, error } = await supabase
    .from('policy_numbers')
    .select('*')
    .eq('policy_id', policyId);
  
  if (error) {
    console.error('Error fetching policy numbers:', error);
    throw error;
  }
  
  return data || [];
};

export const createPolicyNumber = async (policyNumber: Omit<PolicyNumber, 'id'>): Promise<PolicyNumber> => {
  const { data, error } = await supabase
    .from('policy_numbers')
    .insert(policyNumber)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating policy number:', error);
    throw error;
  }
  
  return data;
};

export const deletePolicyNumber = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('policy_numbers')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting policy number:', error);
    throw error;
  }
};

// File operations
export const uploadFile = async (file: File, bucketName: string = 'client-documents'): Promise<string> => {
  const filePath = `${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file);
  
  if (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
  
  const { data: publicUrlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(data.path);
  
  return publicUrlData.publicUrl;
};

export const deleteFile = async (filePath: string, bucketName: string = 'client-documents'): Promise<void> => {
  const { error } = await supabase.storage
    .from(bucketName)
    .remove([filePath]);
  
  if (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// Schedule Documents operations
export const createScheduleDoc = async (scheduleDoc: Omit<ScheduleDoc, 'id' | 'uploaded_at'>): Promise<ScheduleDoc> => {
  const { data, error } = await supabase
    .from('schedule_docs')
    .insert(scheduleDoc)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating schedule document:', error);
    throw error;
  }
  
  return data;
};

export const getScheduleDocs = async (policyId: string): Promise<ScheduleDoc[]> => {
  const { data, error } = await supabase
    .from('schedule_docs')
    .select('*')
    .eq('policy_id', policyId);
  
  if (error) {
    console.error('Error fetching schedule documents:', error);
    throw error;
  }
  
  return data || [];
};

export const deleteScheduleDoc = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('schedule_docs')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting schedule document:', error);
    throw error;
  }
};

// PDF Documents operations
export const createPdfDoc = async (pdfDoc: Omit<PdfDoc, 'id' | 'uploaded_at'>): Promise<PdfDoc> => {
  const { data, error } = await supabase
    .from('pdf_docs')
    .insert(pdfDoc)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating PDF document:', error);
    throw error;
  }
  
  return data;
};

export const getPdfDocs = async (policyId: string): Promise<PdfDoc[]> => {
  const { data, error } = await supabase
    .from('pdf_docs')
    .select('*')
    .eq('policy_id', policyId);
  
  if (error) {
    console.error('Error fetching PDF documents:', error);
    throw error;
  }
  
  return data || [];
};

export const deletePdfDoc = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('pdf_docs')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting PDF document:', error);
    throw error;
  }
};

// LOA Documents operations
export const createLoaDoc = async (loaDoc: Omit<LoaDoc, 'id' | 'uploaded_at'>): Promise<LoaDoc> => {
  const { data, error } = await supabase
    .from('loa_docs')
    .insert(loaDoc)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating LOA document:', error);
    throw error;
  }
  
  return data;
};

export const getLoaDoc = async (policyId: string): Promise<LoaDoc | null> => {
  const { data, error } = await supabase
    .from('loa_docs')
    .select('*')
    .eq('policy_id', policyId)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching LOA document:', error);
    throw error;
  }
  
  return data;
};

export const deleteLoaDoc = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('loa_docs')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting LOA document:', error);
    throw error;
  }
};

// Combined data fetching for dashboard display
export const getClientDataByMonth = async (month: number, year: number = new Date().getFullYear()): Promise<ClientData[]> => {
  try {
    // Step 1: Get all clients
    const clients = await getClients();
    
    // Step 2: Get policies for the specified month
    const policies = await getClientPoliciesByMonth(month, year);
    
    // Step 3: Create a map to build complete client data
    const clientDataMap: Record<string, ClientData> = {};
    
    // Initialize with clients that have policies for this month only
    const clientsWithPoliciesThisMonth = new Set(policies.map(p => p.client_id));
    
    for (const client of clients) {
      // Only include clients that have policies for this month
      if (clientsWithPoliciesThisMonth.has(client.id)) {
        clientDataMap[client.id] = {
          id: client.id,
          name: client.name,
          location: client.location,
          policiesCount: 0,
          products: [],
          scheduleDocsUrl: [],
          pdfDocsUrl: [],
          policyNumbers: [],
          issueDate: '',
          deductionDate: '',
          loaDocUrl: undefined,
          policyPremium: '0',
        };
      }
    }
    
    // Process each policy
    for (const policy of policies) {
      if (!clientDataMap[policy.client_id]) continue;
      
      // Update policy count and dates
      clientDataMap[policy.client_id].policiesCount = policy.policies_count;
      clientDataMap[policy.client_id].policyPremium = `R${policy.policy_premium.toFixed(2)}`;
      
      if (policy.issue_date) {
        clientDataMap[policy.client_id].issueDate = policy.issue_date;
      }
      
      if (policy.deduction_date) {
        clientDataMap[policy.client_id].deductionDate = policy.deduction_date;
      }
      
      // Fetch products
      const products = await getPolicyProducts(policy.id);
      clientDataMap[policy.client_id].products = products.map(p => p.product);
      
      // Fetch policy numbers
      const policyNumbers = await getPolicyNumbers(policy.id);
      clientDataMap[policy.client_id].policyNumbers = policyNumbers.map(pn => pn.policy_number);
      
      // Fetch schedule docs
      const scheduleDocs = await getScheduleDocs(policy.id);
      clientDataMap[policy.client_id].scheduleDocsUrl = scheduleDocs.map(doc => doc.file_path);
      
      // Fetch PDF docs
      const pdfDocs = await getPdfDocs(policy.id);
      clientDataMap[policy.client_id].pdfDocsUrl = pdfDocs.map(doc => doc.file_path);
      
      // Fetch LOA doc
      const loaDoc = await getLoaDoc(policy.id);
      if (loaDoc) {
        clientDataMap[policy.client_id].loaDocUrl = loaDoc.file_path;
      }
    }
    
    return Object.values(clientDataMap);
  } catch (error) {
    console.error('Error getting client data by month:', error);
    throw error;
  }
};

// Function to save a complete client data entry
export const saveClientData = async (clientData: ClientData, month: number, year: number = new Date().getFullYear()): Promise<ClientData> => {
  try {
    let client: Client;
    
    // Step 1: Create or update client
    if (clientData.id && !clientData.id.startsWith('client-temp')) {
      // Update existing client
      client = await updateClient(clientData.id, {
        name: clientData.name,
        location: clientData.location
      });
    } else {
      // Create new client
      client = await createClient({
        name: clientData.name,
        location: clientData.location
      });
    }
    
    // Step 2: Get or create client policy for the month
    const existingPolicies = await supabase
      .from('client_policies')
      .select('*')
      .eq('client_id', client.id)
      .eq('month', month)
      .eq('year', year);
    
    if (existingPolicies.error) throw existingPolicies.error;
    
    let clientPolicy: ClientPolicy;
    
    if (existingPolicies.data && existingPolicies.data.length > 0) {
      // Update existing policy
      clientPolicy = await updateClientPolicy(existingPolicies.data[0].id, {
        policies_count: clientData.policiesCount,
        policy_premium: parseFloat(clientData.policyPremium.replace(/[^0-9.]/g, '')),
        issue_date: clientData.issueDate || null,
        deduction_date: clientData.deductionDate || null
      });
    } else {
      // Create new policy with month and year as numbers
      clientPolicy = await createClientPolicy({
        client_id: client.id,
        month: month,
        year: year,
        policies_count: clientData.policiesCount,
        policy_premium: parseFloat(clientData.policyPremium.replace(/[^0-9.]/g, '')),
        issue_date: clientData.issueDate || null,
        deduction_date: clientData.deductionDate || null
      });
    }
    
    // Step 3: Handle products - clear existing and add new
    await supabase
      .from('policy_products')
      .delete()
      .eq('policy_id', clientPolicy.id);
    
    for (const product of clientData.products) {
      await createPolicyProduct({ policy_id: clientPolicy.id, product });
    }
    
    // Step 4: Handle policy numbers - clear existing and add new
    await supabase
      .from('policy_numbers')
      .delete()
      .eq('policy_id', clientPolicy.id);
    
    for (const policyNumber of clientData.policyNumbers) {
      await createPolicyNumber({ policy_id: clientPolicy.id, policy_number: policyNumber });
    }
    
    // Return updated client data
    return {
      ...clientData,
      id: client.id,
      policyPremium: clientData.policyPremium.startsWith('R') ? 
        clientData.policyPremium : 
        `R${parseFloat(clientData.policyPremium).toFixed(2)}`
    };
  } catch (error) {
    console.error('Error saving client data:', error);
    throw error;
  }
};

// Function to delete a client's policy for a specific month
export const deleteClientData = async (clientId: string, month?: number, year: number = new Date().getFullYear()): Promise<void> => {
  try {
    // If month is specified, only delete the policy for that month
    if (month !== undefined) {
      // Get policies for the client in the specified month
      const { data: policies } = await supabase
        .from('client_policies')
        .select('id')
        .eq('client_id', clientId)
        .eq('month', month)
        .eq('year', year);
      
      // Delete each policy
      if (policies && policies.length > 0) {
        for (const policy of policies) {
          await deleteClientPolicy(policy.id);
        }
      }
    } else {
      // Delete all client data if no month is specified
      await deleteClient(clientId);
    }
  } catch (error) {
    console.error('Error deleting client data:', error);
    throw error;
  }
};

// Get all client summaries for the summary dashboard
export const getClientSummaries = async (): Promise<{ name: string; location: string; totalPolicies: number; totalPremium: number; }[]> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        id,
        name,
        location,
        client_policies (
          policies_count,
          policy_premium
        )
      `);
    
    if (error) throw error;
    
    return data.map(client => {
      // Calculate totals from all policies
      let totalPolicies = 0;
      let totalPremium = 0;
      
      if (client.client_policies) {
        for (const policy of client.client_policies) {
          totalPolicies += policy.policies_count;
          totalPremium += parseFloat(policy.policy_premium);
        }
      }
      
      return {
        name: client.name,
        location: client.location,
        totalPolicies,
        totalPremium
      };
    });
  } catch (error) {
    console.error('Error getting client summaries:', error);
    throw error;
  }
};
