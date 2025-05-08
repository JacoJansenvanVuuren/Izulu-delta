import React, { useState, useEffect, useCallback } from 'react';
import { uploadPdf } from '../utils/supabaseDashboard';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FileUpload from '@/components/FileUpload';
import MultiFileUpload from '@/components/MultiFileUpload';
import MultiEntryField from '@/components/MultiEntryField';
import { Plus, Trash2, Search, FileText, AlertCircle, Calendar } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Client {
  id: string;
  name: string;
  location: string;
  policiesCount: number;
  products: string[];
  scheduleDocsUrl?: string[];
  pdfDocsUrl?: string[];
  policyNumbers: string[];
  issueDate: string;
  deductionDate: string;
  loaDocUrl?: string;
  policyPremium: string;
}

interface ClientTableProps {
  initialClients: Client[];
  onAddClient?: (client: Client, cb?: (err?: string) => void) => void;
  onUpdateClient?: (client: Client, cb?: (err?: string) => void) => void;
  onDeleteClient?: (id: string, cb?: (err?: string) => void) => void;
}

const ClientTable = ({ initialClients, onAddClient, onUpdateClient, onDeleteClient }: ClientTableProps) => {
  // Convert string products and policyNumbers to arrays for existing clients
  const formattedInitialClients = initialClients.map(client => ({
    ...client,
    products: Array.isArray(client.products) ? client.products : [],
    policyNumbers: Array.isArray(client.policyNumbers) ? client.policyNumbers : [client.policyNumbers],
    scheduleDocsUrl: Array.isArray(client.scheduleDocsUrl) ? client.scheduleDocsUrl : client.scheduleDocsUrl ? [client.scheduleDocsUrl] : [],
    pdfDocsUrl: Array.isArray(client.pdfDocsUrl) ? client.pdfDocsUrl : client.pdfDocsUrl ? [client.pdfDocsUrl] : []
  }));

  // Track original clients to detect changes
  const [originalClients, setOriginalClients] = useState<Client[]>(formattedInitialClients);
  const [currentClients, setCurrentClients] = useState<Client[]>(formattedInitialClients);

  // Sync local state with initialClients if it changes (e.g., after global delete)
  useEffect(() => {
    setOriginalClients(formattedInitialClients);
    setCurrentClients(formattedInitialClients);
  }, [initialClients]);

  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // Update parent component when clients change
  const updateClients = useCallback((updatedClients: Client[]) => {
    setCurrentClients(updatedClients);
    
    // Check if there are any changes compared to the original clients
    const changesDetected = JSON.stringify(updatedClients) !== JSON.stringify(originalClients);
    setHasChanges(changesDetected);
  }, [originalClients]);

  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Filter clients based on search term
  const filteredClients = currentClients.filter(client => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      client.name.toLowerCase().includes(searchLower) ||
      client.location.toLowerCase().includes(searchLower) ||
      client.policyNumbers.some(num => num.toLowerCase().includes(searchLower)) ||
      client.products.some(product => product.toLowerCase().includes(searchLower)) ||
      client.policyPremium.toLowerCase().includes(searchLower)
    );
  });

  // Robust Supabase PDF/file upload logic
  const handleFileUpload = async (clientId: string, field: 'loaDocUrl', file: File) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const client = currentClients.find(c => c.id === clientId);
      if (!client) throw new Error('Client not found');
      const path = `${clientId}/${field}/${Date.now()}_${file.name}`;
      const url = await uploadPdf(file, path);
      if (onUpdateClient) {
        onUpdateClient({ ...client, [field]: url }, (err) => {
          setActionLoading(false);
          if (err) setActionError(err);
        });
      } else {
        setActionLoading(false);
      }
    } catch (err) {
      setActionLoading(false);
      setActionError(err.message);
    }
  };

  const handleMultiFileUpload = async (clientId: string, field: 'scheduleDocsUrl' | 'pdfDocsUrl', file: File) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const client = currentClients.find(c => c.id === clientId);
      if (!client) throw new Error('Client not found');
      const path = `${clientId}/${field}/${Date.now()}_${file.name}`;
      const url = await uploadPdf(file, path);
      const updatedUrls = [...(client[field] || []), url];
      if (onUpdateClient) {
        onUpdateClient({ ...client, [field]: updatedUrls }, (err) => {
          setActionLoading(false);
          if (err) setActionError(err);
        });
      } else {
        setActionLoading(false);
      }
    } catch (err) {
      setActionLoading(false);
      setActionError(err.message);
    }
  };

  const removeFile = async (clientId: string, field: 'scheduleDocsUrl' | 'pdfDocsUrl', index: number) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const client = currentClients.find(c => c.id === clientId);
      if (!client) throw new Error('Client not found');
      const updatedUrls = (client[field] || []).filter((_, i) => i !== index);
      if (onUpdateClient) {
        onUpdateClient({ ...client, [field]: updatedUrls }, (err) => {
          setActionLoading(false);
          if (err) setActionError(err);
        });
      } else {
        setActionLoading(false);
      }
    } catch (err) {
      setActionLoading(false);
      setActionError(err.message);
    }
  };

  const updateMultiEntryField = (clientId: string, field: 'products' | 'policyNumbers', values: string[]) => {
    const updatedClients = currentClients.map(client => 
      client.id === clientId 
        ? { ...client, [field]: values } 
        : client
    );
    updateClients(updatedClients);
  };

  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const addNewClient = () => {
    setActionLoading(true);
    setActionError(null);
    const newClient: Client = {
      id: undefined as any, // let backend assign
      name: '',
      location: '',
      policiesCount: 0,
      products: [],
      policyNumbers: [],
      scheduleDocsUrl: [],
      pdfDocsUrl: [],
      issueDate: '',
      deductionDate: '',
      policyPremium: '',
    };
    if (onAddClient) {
      onAddClient(newClient, (err) => {
        setActionLoading(false);
        if (err) setActionError(err);
      });
    } else {
      setActionLoading(false);
    }
  };

  const confirmDeleteClient = () => {
    if (!clientToDelete) return;
    setActionLoading(true);
    setActionError(null);
    if (onDeleteClient) {
      onDeleteClient(clientToDelete.id, (err) => {
        setActionLoading(false);
        if (err) setActionError(err);
        setClientToDelete(null);
      });
    } else {
      setActionLoading(false);
      setClientToDelete(null);
    }
  };

  const initiateClientDeletion = (client: Client) => {
    setClientToDelete(client);
  };

  const updateClientField = (clientId: string, field: keyof Client, value: string | number) => {
    setActionLoading(true);
    setActionError(null);
    const client = currentClients.find(c => c.id === clientId);
    if (client && onUpdateClient) {
      onUpdateClient({ ...client, [field]: value }, (err) => {
        setActionLoading(false);
        if (err) setActionError(err);
      });
    } else {
      setActionLoading(false);
    }
  };

  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  return (
    <div className="space-y-4 relative">
      {/* Error message for actions */}
      {actionError && (
        <div style={{ color: 'red', marginBottom: 16, textAlign: 'center' }}>{actionError}</div>
      )}

      {/* Search and actions bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients, policies, or products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-transparent border-white/10 w-full sm:w-80 focus:w-full expandable-input"
          />
        </div>
        
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <Button onClick={addNewClient} className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" /> Add New Row
          </Button>
        </div>
      </div>
      
      {/* Desktop Table View */}
      <div className="glass-morphism rounded-lg overflow-hidden hidden sm:block">
        <Table>
          <TableHeader className="bg-black/30">
            <TableRow>
              <TableHead className="text-left font-medium w-48 py-4">Client Name</TableHead>
              <TableHead className="text-left font-medium w-40">Location</TableHead>
              <TableHead className="text-left font-medium">Number of Policies</TableHead>
              <TableHead className="text-left font-medium w-48">Products</TableHead>
              <TableHead className="text-left font-medium">Schedule docs</TableHead>
              <TableHead className="text-left font-medium">PDF DOC's</TableHead>
              <TableHead className="text-left font-medium w-48">Policy Numbers</TableHead>
              <TableHead className="text-left font-medium">Issue date</TableHead>
              <TableHead className="text-left font-medium">Deduction date</TableHead>
              <TableHead className="text-left font-medium">LOA and cancellation</TableHead>
              <TableHead className="text-left font-medium w-32">Policy premium</TableHead>
              <TableHead className="text-left font-medium w-16">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id} className="border-t border-white/5 hover:bg-white/5">
                <TableCell>
                  <Input 
                    value={client.name} 
                    onChange={(e) => updateClientField(client.id, 'name', e.target.value)}
                    className="bg-transparent border-white/10 w-full min-w-[150px] expandable-input" 
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    value={client.location} 
                    onChange={(e) => updateClientField(client.id, 'location', e.target.value)}
                    className="bg-transparent border-white/10 w-full min-w-[120px] expandable-input" 
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    type="number"
                    value={client.policiesCount}
                    onChange={(e) => updateClientField(client.id, 'policiesCount', parseInt(e.target.value) || 0)}
                    className="bg-transparent border-white/10"
                  />
                </TableCell>
                <TableCell>
                  <MultiEntryField 
                    values={client.products}
                    onChange={(values) => updateMultiEntryField(client.id, 'products', values)}
                    placeholder="Add a product"
                  />
                </TableCell>
                <TableCell>
                  <MultiFileUpload 
                    onFileUpload={(file) => handleMultiFileUpload(client.id, 'scheduleDocsUrl', file)}
                    files={client.scheduleDocsUrl || []}
                    onRemove={(index) => removeFile(client.id, 'scheduleDocsUrl', index)}
                    label="Schedule Documents"
                  />
                </TableCell>
                <TableCell>
                  <MultiFileUpload 
                    onFileUpload={(file) => handleMultiFileUpload(client.id, 'pdfDocsUrl', file)}
                    files={client.pdfDocsUrl || []}
                    onRemove={(index) => removeFile(client.id, 'pdfDocsUrl', index)}
                    label="PDF Documents"
                  />
                </TableCell>
                <TableCell>
                  <MultiEntryField 
                    values={client.policyNumbers}
                    onChange={(values) => updateMultiEntryField(client.id, 'policyNumbers', values)}
                    placeholder="Add a policy number"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    type="date"
                    value={client.issueDate}
                    onChange={(e) => updateClientField(client.id, 'issueDate', e.target.value)}
                    className="bg-transparent border-white/10"
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    type="date"
                    value={client.deductionDate}
                    onChange={(e) => updateClientField(client.id, 'deductionDate', e.target.value)}
                    className="bg-transparent border-white/10"
                  />
                </TableCell>
                <TableCell>
                  <FileUpload 
                    onFileUpload={(file) => handleFileUpload(client.id, 'loaDocUrl', file)}
                    label="LOA and Cancellation Letter"
                    fileUrl={client.loaDocUrl}
                  />
                </TableCell>
                <TableCell>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2">R</span>
                    <Input 
                      value={client.policyPremium.replace(/^[$R]/, '')}
                      onChange={(e) => {
                        const value = e.target.value.replace(/^[$R]/, '');
                        updateClientField(client.id, 'policyPremium', value);
                      }}
                      className="bg-transparent border-white/10 w-full min-w-[130px] pl-7"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => initiateClientDeletion(client)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remove client</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Dialog */}
      <AlertDialog
        open={!!clientToDelete}
        onOpenChange={(open) => { if (!open) setClientToDelete(null); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {clientToDelete?.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setClientToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteClient} className="bg-destructive text-white hover:bg-destructive/80">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientTable;
