import React, { useState, useEffect, useCallback } from 'react';
import { uploadPdf } from '../utils/supabaseDashboard';
import { ProductOption } from '../utils/supabaseDashboard';

// Define the product options
const PRODUCT_OPTIONS: ProductOption[] = [
  'Value Funeral Plan', 
  'Enhanced Priority Plan', 
  'All in One Funeral', 
  'Immediate Life Cover'
];

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FileUpload from '@/components/FileUpload';
import MultiFileUpload from '@/components/MultiFileUpload';
import MultiEntryField from '@/components/MultiEntryField';
import MultiDateField from './MultiDateField';
import { Plus, Trash2, Search, FileText, AlertCircle, Save, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Client {
  id: string;
  name: string;
  location: string;
  fnaSummaryUrl?: string[];
  policiesCount: number;
  products: string[];
  scheduleDocsUrl?: string[];
  pdfDocsUrl?: string[];
  policyNumbers: string[];
  issueDate: string | string[] | Date[] | undefined;
  deductionDate: string | string[] | Date[] | undefined;
  loaDocUrl?: string[];
  policyPremium: string;
  stopOrder?: string;
}

interface ClientTableProps {
  initialClients: Client[];
  onAddClient?: (client: Client, cb?: (err?: string) => void) => void;
  onUpdateClient?: (client: Client, cb?: (err?: string) => void) => void;
  onDeleteClient?: (id: string, cb?: (err?: string) => void) => void;
  selectedMonth: number;
  currentYear: number;
}

const ClientTable = ({ initialClients, onAddClient, onUpdateClient, onDeleteClient, selectedMonth, currentYear }: ClientTableProps): JSX.Element | null => {
  const [selectedProduct, setSelectedProduct] = useState('');
  // Deduction type cache for localStorage persistence
  const [deductionTypeCache, setDeductionTypeCache] = useState<Record<string, string>>({});
  // Ensure initialClients is always an array
  const safeInitialClients = initialClients || [];

  // On mount, load deduction type selections from localStorage
  useEffect(() => {
    const cache: Record<string, string> = {};
    safeInitialClients.forEach(client => {
      const stored = localStorage.getItem(`deductionType_${client.id}`);
      if (stored) cache[client.id] = stored;
    });
    setDeductionTypeCache(cache);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeInitialClients.length]);

  // Return loading state if clients are null or empty and no ability to add
  if (safeInitialClients.length === 0 && !onAddClient) return (
    <div className="flex justify-center items-center h-full">
      <p className="text-muted-foreground">No clients available. Click 'Add New Row' to get started.</p>
    </div>
  );
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  // Convert string products and policyNumbers to arrays for existing clients
  const formattedInitialClients = safeInitialClients.map(client => ({
    ...client,
    products: Array.isArray(client.products) ? client.products : [],
    policyNumbers: Array.isArray(client.policyNumbers) ? client.policyNumbers : (client.policyNumbers ? [client.policyNumbers] : []),
    scheduleDocsUrl: Array.isArray(client.scheduleDocsUrl) ? client.scheduleDocsUrl : (client.scheduleDocsUrl ? [client.scheduleDocsUrl] : []),
    pdfDocsUrl: Array.isArray(client.pdfDocsUrl) ? client.pdfDocsUrl : (client.pdfDocsUrl ? [client.pdfDocsUrl] : []),
    issueDate: Array.isArray(client.issueDate) 
      ? client.issueDate.map(d => d instanceof Date ? d : new Date(d)) 
      : (client.issueDate ? [new Date(client.issueDate)] : []),
    deductionDate: Array.isArray(client.deductionDate) 
      ? client.deductionDate.map(d => d instanceof Date ? d : new Date(d)) 
      : (client.deductionDate ? [new Date(client.deductionDate)] : [])
  }));

  // Track original clients to detect changes
  const [originalClients, setOriginalClients] = useState<Client[]>(formattedInitialClients);
  const [clients, setClients] = useState<Client[]>(formattedInitialClients);
  const [unsavedChanges, setUnsavedChanges] = useState<{[key: string]: Partial<Client>}>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  // Track which row is currently being edited
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  // Sync local state with initialClients if it changes (e.g., after global delete)
  useEffect(() => {
    setOriginalClients(formattedInitialClients);
    setClients(formattedInitialClients);
    setUnsavedChanges({});
    setHasUnsavedChanges(false);
  }, [initialClients]);

  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filter clients based on search term
  const filteredClients = clients.filter(client => {
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

  // Auto-save when row changes
  const autoSaveRow = async (clientId: string) => {
    // Don't do anything if there are no changes for this client
    if (!unsavedChanges[clientId]) return;
    
    const client = clients.find(c => c.id === clientId);
    if (!client || !onUpdateClient) return;

    try {
      setActionLoading(true);
      setActionError(null);
      
      await new Promise<void>((resolve, reject) => {
        onUpdateClient(
          { ...client, ...unsavedChanges[clientId] },
          (err) => {
            if (err) reject(new Error(err));
            else resolve();
          }
        );
      });
      
      // Clear saved changes for this client
      setUnsavedChanges(prev => {
        const newChanges = { ...prev };
        delete newChanges[clientId];
        return newChanges;
      });
      
      // Update hasUnsavedChanges if no more changes
      if (Object.keys(unsavedChanges).length <= 1) {
        setHasUnsavedChanges(false);
      }
    } catch (error: any) {
      setActionError(error instanceof Error ? error.message : 'An error occurred while saving changes');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle row click to set active row
  const handleRowClick = (clientId: string) => {
    if (activeRowId && activeRowId !== clientId) {
      // Auto-save previous row
      autoSaveRow(activeRowId);
    }
    setActiveRowId(clientId);
  };

  // Handle clicking outside any row
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Check if click is outside any row
      const target = e.target as Element;
      const isOutsideRow = !target.closest('tr');
      const isOutsideTable = !target.closest('table');
      const isSaveButton = target.closest('button')?.textContent?.includes('Save Changes');
      
      if ((isOutsideRow || isOutsideTable) && !isSaveButton && activeRowId) {
        autoSaveRow(activeRowId);
        setActiveRowId(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeRowId, unsavedChanges]);

  // Robust Supabase PDF/file upload logic
  const handleFileUpload = async (clientId: string, field: 'loaDocUrl', file: File) => {
    setUnsavedChanges(prev => ({ ...prev, [clientId]: { ...(prev[clientId] || {}) } }));
    setActionLoading(true);
    setActionError(null);
    try {
      const client = clients.find(c => c.id === clientId);
      if (!client) throw new Error('Client not found');
      const path = `${clientId}/${field}/${Date.now()}_${file.name}`;
      const url = await uploadPdf(file, path);
      
      // Update local state instead of immediately sending to server
      const updatedClients = clients.map(c => 
        c.id === clientId ? { ...c, [field]: url } : c
      );
      setClients(updatedClients);
      
      setUnsavedChanges(prev => ({
        ...prev,
        [clientId]: { ...(prev[clientId] || {}), [field]: url }
      }));
      
      setHasUnsavedChanges(true);
      setActionLoading(false);
    } catch (err: any) {
      setActionLoading(false);
      setActionError(err.message);
    }
  };

  const handleMultiFileUpload = async (clientId: string, field: 'scheduleDocsUrl' | 'pdfDocsUrl' | 'loaDocUrl' | 'fnaSummaryUrl', file: File) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const client = clients.find(c => c.id === clientId);
      if (!client) throw new Error('Client not found');
      const path = `${clientId}/${field}/${Date.now()}_${file.name}`;
      const url = await uploadPdf(file, path);
      const updatedUrls = [...(client[field] || []), url];
      
      // Update local state
      const updatedClients = clients.map(c => 
        c.id === clientId ? { ...c, [field]: updatedUrls } : c
      );
      setClients(updatedClients);
      
      setUnsavedChanges(prev => ({
        ...prev,
        [clientId]: { ...(prev[clientId] || {}), [field]: updatedUrls }
      }));
      
      setHasUnsavedChanges(true);
      setActionLoading(false);
    } catch (err: any) {
      setActionLoading(false);
      setActionError(err.message);
    }
  };

  const removeFile = async (clientId: string, field: 'scheduleDocsUrl' | 'pdfDocsUrl' | 'loaDocUrl' | 'fnaSummaryUrl', index: number) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const client = clients.find(c => c.id === clientId);
      if (!client) throw new Error('Client not found');
      const updatedUrls = (client[field] || []).filter((_, i) => i !== index);
      
      // Update local state
      const updatedClients = clients.map(c => 
        c.id === clientId ? { ...c, [field]: updatedUrls } : c
      );
      setClients(updatedClients);
      
      setUnsavedChanges(prev => ({
        ...prev,
        [clientId]: { ...(prev[clientId] || {}), [field]: updatedUrls }
      }));
      
      setHasUnsavedChanges(true);
      setActionLoading(false);
    } catch (err: any) {
      setActionLoading(false);
      setActionError(err.message);
    }
  };

  const updateMultiEntryField = (clientId: string, field: 'products' | 'policyNumbers', values: string[]) => {
    const updatedClients = clients.map(client => 
      client.id === clientId 
        ? { ...client, [field]: values } 
        : client
    );
    setClients(updatedClients);
    setUnsavedChanges(prev => ({
      ...prev,
      [clientId]: { ...(prev[clientId] || {}), [field]: values }
    }));
    setHasUnsavedChanges(true);
  };

  const updateClientField = (clientId: string, field: keyof Client, value: string | string[] | number) => {
    const updatedClients = clients.map(client => 
      client.id === clientId ? { ...client, [field]: value } : client
    );
    setClients(updatedClients);
    setUnsavedChanges(prev => ({
      ...prev,
      [clientId]: { ...(prev[clientId] || {}), [field]: value }
    }));
    setHasUnsavedChanges(true);
  };

  const initiateClientDeletion = (client: Client) => {
    setClientToDelete(client);
  };

  const confirmDeleteClient = async () => {
    if (!clientToDelete || !onDeleteClient) return;

    try {
      setActionLoading(true);
      setActionError(null);

      await new Promise<void>((resolve, reject) => {
        onDeleteClient(clientToDelete.id, (err) => {
          if (err) {
            reject(new Error(err || 'Failed to delete client'));
          } else {
            resolve();
          }
        });
      });
    } catch (error: any) {
      setActionError(error instanceof Error ? error.message : 'An error occurred during client deletion');
    } finally {
      // Always reset client to delete and loading state
      setClientToDelete(null);
      setActionLoading(false);
    }
  };

  const addNewClient = () => {
    if (!onAddClient) return;

    try {
      setActionLoading(true);
      setActionError(null);

      const newClient: Client = {
        id: `temp_${crypto.randomUUID()}`,
        name: '',
        location: '',
        policiesCount: 0,
        products: [],
        policyNumbers: [],
        issueDate: '',
        deductionDate: '',
        policyPremium: ''
      };

      // Immediately add the new client to the top of the list
      setClients(prevClients => [newClient, ...prevClients]);

      onAddClient(newClient, (err) => {
        setActionLoading(false);
        if (err) {
          setActionError(err);
          // Remove the temporary client if there's an error
          setClients(prevClients => prevClients.filter(c => c.id !== newClient.id));
        }
      });
    } catch (error: any) {
      setActionLoading(false);
      setActionError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const saveAllChanges = async () => {
    if (!onUpdateClient || Object.keys(unsavedChanges).length === 0) return;
    
    setActionLoading(true);
    setActionError(null);
    
    try {
      const promises = Object.entries(unsavedChanges).map(([clientId, changes]) => {
        const client = clients.find(c => c.id === clientId);
        if (!client) return Promise.resolve();
        
        return new Promise<void>((resolve, reject) => {
          onUpdateClient?.(
            { ...client, ...changes },
            (err) => {
              if (err) reject(new Error(err));
              else resolve();
            }
          );
        });
      });
      
      await Promise.all(promises);
      
      // Clear all unsaved changes
      setUnsavedChanges({});
      setHasUnsavedChanges(false);
    } catch (error: any) {
      setActionError(error instanceof Error ? error.message : 'An error occurred while saving changes');
    } finally {
      setActionLoading(false);
    }
  };

  // Custom date input handler that toggles the date picker
  const handleDateIconClick = (inputId: string) => {
    const dateInput = document.getElementById(inputId) as HTMLInputElement;
    if (dateInput) {
      dateInput.showPicker();
    }
  };

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
          <Button 
            onClick={addNewClient} 
            className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 w-full sm:w-auto"
            disabled={actionLoading}
          >
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
              <TableHead className="text-left font-medium w-40">FNA Summary</TableHead>
              <TableHead className="text-left font-medium">Number of Policies</TableHead>
              <TableHead className="text-left font-medium w-64">Products</TableHead>
              <TableHead className="text-left font-medium">Schedule docs</TableHead>
              <TableHead className="text-left font-medium">PDF DOC's</TableHead>
              <TableHead className="text-left font-medium w-48">Policy Numbers</TableHead>
              <TableHead className="text-left font-medium">Issue date</TableHead>
              <TableHead className="text-left font-medium">Deduction date</TableHead>
              <TableHead className="text-left font-medium">LOA and cancellation</TableHead>
              <TableHead className="text-left font-medium w-32">Policy premium</TableHead>
              <TableHead className="text-left font-medium w-40">Deduction Type</TableHead>
              <TableHead className="text-left font-medium w-16">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow 
                key={client.id} 
                className="border-t border-white/5 hover:bg-white/5"
                onClick={() => handleRowClick(client.id)}
              >
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
                  <MultiFileUpload 
                    onFileUpload={(file) => handleMultiFileUpload(client.id, 'fnaSummaryUrl', file)}
                    files={client.fnaSummaryUrl || []}
                    onRemove={(index) => removeFile(client.id, 'fnaSummaryUrl', index)}
                    label="FNA Summary"
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
                  <div className="min-w-[250px]">
                    <div className="grid grid-cols-2 gap-1 mb-1">
                      {client.products.map((product, index) => (
                        <div 
                          key={index}
                          className="inline-flex items-center gap-1 bg-secondary/30 text-secondary-foreground text-[11px] px-2 py-0.5 rounded-full overflow-hidden"
                        >
                          <span className="truncate">{product}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const newProducts = client.products.filter((_, i) => i !== index);
                              updateMultiEntryField(client.id, 'products', newProducts);
                            }}
                            className="flex-shrink-0 text-muted-foreground hover:text-foreground ml-0.5"
                          >
                            <X className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <Select
                      value={selectedProduct}
                      onValueChange={(value) => {
                        if (value && !client.products.includes(value)) {
                          const newProducts = [...client.products, value];
                          updateMultiEntryField(client.id, 'products', newProducts);
                          setSelectedProduct(''); // Reset the selected value
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Add Product" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRODUCT_OPTIONS.map((option) => (
                          <SelectItem 
                            key={option} 
                            value={option}
                            disabled={client.products.includes(option)}
                            className="text-sm"
                          >
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
                  <div className="relative flex items-center">
                    <MultiDateField
                      label="Issue Date"
                      fieldName="issueDate"
                      className="w-full"
                      value={unsavedChanges[client.id]?.issueDate ?? client.issueDate}
                      onChange={(dates: Date[]) => {
                        setUnsavedChanges(prev => ({
                          ...prev,
                          [client.id]: { ...(prev[client.id] || {}), issueDate: dates.map(d => d.toISOString()) }
                        }));
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="relative flex items-center">
                    <MultiDateField
                      label="Deduction Date"
                      fieldName="deductionDate"
                      className="w-full"
                      value={unsavedChanges[client.id]?.deductionDate ?? client.deductionDate}
                      onChange={(dates: Date[]) => {
                        setUnsavedChanges(prev => ({
                          ...prev,
                          [client.id]: { ...(prev[client.id] || {}), deductionDate: dates.map(d => d.toISOString()) }
                        }));
                        setHasUnsavedChanges(true);
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <MultiFileUpload 
                    onFileUpload={(file) => handleMultiFileUpload(client.id, 'loaDocUrl', file)}
                    files={client.loaDocUrl || []}
                    onRemove={(index) => removeFile(client.id, 'loaDocUrl', index)}
                    label="LOA and Cancellation Letters"
                  />
                </TableCell>
                <TableCell>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2">R</span>
                    <Input 
                      value={(client.policyPremium || '').replace(/^[$R]/, '')}
                      onChange={(e) => {
                        const value = (e.target.value || '').replace(/^[$R]/, '');
                        updateClientField(client.id, 'policyPremium', value);
                      }}
                      className="bg-transparent border-white/10 w-full min-w-[130px] pl-7"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={client.stopOrder || deductionTypeCache[client.id] || undefined}
                    onValueChange={(value) => {
                      updateClientField(client.id, 'stopOrder', value || '');
                      setDeductionTypeCache((prev: Record<string, string>) => {
                        const updated = { ...prev, [client.id]: value };
                        // Persist to localStorage
                        localStorage.setItem(`deductionType_${client.id}`, value);
                        return updated;
                      });
                    }}
                  >
                    <SelectTrigger className="w-full min-w-[200px]">
                      <SelectValue placeholder="Select Deduction Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="Deductions Exceeded">Deductions Exceeded</SelectItem>
                      <SelectItem value="Debi-Check">Debi-Check</SelectItem>
                      <SelectItem value="Pending Stop Order">Pending Stop Order</SelectItem>
                      <SelectItem value="Stop Order">Stop Order</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              initiateClientDeletion(client);
                            }}
                            disabled={actionLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete Client</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Save Changes Button (Fixed Position) - Only shown when needed */}
      {hasUnsavedChanges && Object.keys(unsavedChanges).length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={saveAllChanges}
            disabled={actionLoading}
            className="bg-white text-black hover:bg-gray-200 shadow-lg px-5 py-2 rounded-md transition-all duration-200 opacity-100"
            style={{ backdropFilter: 'none', background: 'white' }}
          >
            <Save className="h-4 w-4 mr-2" /> Save Changes
          </Button>
        </div>
      )}

      {/* Delete Dialog */}
      <AlertDialog
        open={!!clientToDelete}
        onOpenChange={(open) => { if (!open) setClientToDelete(null); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {clientToDelete?.name}? This will only remove them from the current month.
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
