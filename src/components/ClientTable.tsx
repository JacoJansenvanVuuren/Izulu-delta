
import React, { useState } from 'react';
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
  onClientsChange?: (clients: Client[]) => void;
}

const ClientTable = ({ initialClients, onClientsChange }: ClientTableProps) => {
  // Convert string products and policyNumbers to arrays for existing clients
  const formattedInitialClients = initialClients.map(client => ({
    ...client,
    products: Array.isArray(client.products) ? client.products : [],
    policyNumbers: Array.isArray(client.policyNumbers) ? client.policyNumbers : [client.policyNumbers],
    scheduleDocsUrl: Array.isArray(client.scheduleDocsUrl) ? client.scheduleDocsUrl : client.scheduleDocsUrl ? [client.scheduleDocsUrl] : [],
    pdfDocsUrl: Array.isArray(client.pdfDocsUrl) ? client.pdfDocsUrl : client.pdfDocsUrl ? [client.pdfDocsUrl] : []
  }));

  // Use clients directly from props; all state is managed by parent for per-month isolation
  const clients = formattedInitialClients;

  // Update parent component when clients change
  const updateClients = (updatedClients: Client[]) => {
    if (onClientsChange) {
      onClientsChange(updatedClients);
    }
  };
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

  // In a real app, this would interact with your storage solution
  const handleFileUpload = (clientId: string, field: 'loaDocUrl', file: File) => {
    // This is a mock implementation since we can't actually upload files without a backend
    // In a real app, you would upload to a storage provider and get a URL back
    const mockUrl = `mock-url-for-${file.name}`;

    const updatedClients = clients.map(client => 
      client.id === clientId 
        ? { ...client, [field]: mockUrl } 
        : client
    );
    updateClients(updatedClients);
  };

  const handleMultiFileUpload = (clientId: string, field: 'scheduleDocsUrl' | 'pdfDocsUrl', file: File) => {
    // Create a mock URL for this file
    const mockUrl = `mock-url-for-${file.name}`;

    const updatedClients = clients.map(client => 
      client.id === clientId 
        ? { 
            ...client, 
            [field]: [...(client[field] || []), mockUrl]
          } 
        : client
    );
    updateClients(updatedClients);
  };

  const removeFile = (clientId: string, field: 'scheduleDocsUrl' | 'pdfDocsUrl', index: number) => {
    const updatedClients = clients.map(client => 
      client.id === clientId 
        ? { 
            ...client, 
            [field]: client[field]?.filter((_, i) => i !== index) || [] 
          } 
        : client
    );
    updateClients(updatedClients);
  };

  const updateMultiEntryField = (clientId: string, field: 'products' | 'policyNumbers', values: string[]) => {
    const updatedClients = clients.map(client => 
      client.id === clientId 
        ? { ...client, [field]: values } 
        : client
    );
    updateClients(updatedClients);
  };

  const addNewClient = () => {
    const newClient: Client = {
      id: `client-${Date.now()}`,
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

    const updatedClients = [...clients, newClient];
    updateClients(updatedClients);
  };

  const removeClient = (clientId: string) => {
    const updatedClients = clients.filter(client => client.id !== clientId);
    updateClients(updatedClients);
  };

  const updateClientField = (clientId: string, field: keyof Client, value: string | number) => {
    const updatedClients = clients.map(client => 
      client.id === clientId 
        ? { ...client, [field]: value } 
        : client
    );
    updateClients(updatedClients);
  };

  return (
    <div className="space-y-4">
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
                          onClick={() => removeClient(client.id)} 
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
            {filteredClients.length === 0 && (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-12 text-muted-foreground">
                  <div className="flex flex-col items-center justify-center">
                    {searchTerm ? (
                      <>
                        <Search className="h-8 w-8 mb-2 text-muted-foreground/50" />
                        <p>No results found for "{searchTerm}"</p>
                        <Button variant="link" onClick={() => setSearchTerm('')} className="mt-2">
                          Clear search
                        </Button>
                      </>
                    ) : (
                      <>
                        <FileText className="h-8 w-8 mb-2 text-muted-foreground/50" />
                        <p>No client data available for this month</p>
                        <Button variant="link" onClick={addNewClient} className="mt-2">
                          Add your first client
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-4">
        {filteredClients.map((client) => (
          <div key={client.id} className="glass-morphism rounded-lg p-4 flex flex-col gap-3 shadow-md">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-lg">{client.name || <span className="text-muted-foreground">Unnamed Client</span>}</span>
              <Button size="icon" variant="ghost" onClick={() => removeClient(client.id)} className="text-destructive hover:bg-destructive/10">
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="block text-xs text-muted-foreground">Policies</span>
                <Input type="number" value={client.policiesCount} onChange={(e) => updateClientField(client.id, 'policiesCount', parseInt(e.target.value) || 0)} className="w-full mt-1" />
              </div>
              <div>
                <span className="block text-xs text-muted-foreground">Premium</span>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">R</span>
                  <Input value={client.policyPremium.replace(/^[$R]/, '')} onChange={(e) => updateClientField(client.id, 'policyPremium', e.target.value)} className="pl-7 w-full" />
                </div>
              </div>
              <div className="col-span-2">
                <span className="block text-xs text-muted-foreground">Products</span>
                <MultiEntryField values={client.products} onChange={(values) => updateMultiEntryField(client.id, 'products', values)} placeholder="Add a product" />
              </div>
              <div className="col-span-2">
                <span className="block text-xs text-muted-foreground">Policy Numbers</span>
                <MultiEntryField values={client.policyNumbers} onChange={(values) => updateMultiEntryField(client.id, 'policyNumbers', values)} placeholder="Add a policy number" />
              </div>
              <div>
                <span className="block text-xs text-muted-foreground">Issue Date</span>
                <Input type="date" value={client.issueDate} onChange={(e) => updateClientField(client.id, 'issueDate', e.target.value)} className="w-full mt-1" />
              </div>
              <div>
                <span className="block text-xs text-muted-foreground">Deduction Date</span>
                <Input type="date" value={client.deductionDate} onChange={(e) => updateClientField(client.id, 'deductionDate', e.target.value)} className="w-full mt-1" />
              </div>
              <div className="col-span-2">
                <span className="block text-xs text-muted-foreground">Schedule Docs</span>
                <MultiFileUpload onFileUpload={(file) => handleMultiFileUpload(client.id, 'scheduleDocsUrl', file)} files={client.scheduleDocsUrl || []} onRemove={(index) => removeFile(client.id, 'scheduleDocsUrl', index)} label="Schedule Documents" />
              </div>
              <div className="col-span-2">
                <span className="block text-xs text-muted-foreground">PDF Docs</span>
                <MultiFileUpload onFileUpload={(file) => handleMultiFileUpload(client.id, 'pdfDocsUrl', file)} files={client.pdfDocsUrl || []} onRemove={(index) => removeFile(client.id, 'pdfDocsUrl', index)} label="PDF Documents" />
              </div>
              <div className="col-span-2">
                <span className="block text-xs text-muted-foreground">LOA & Cancellation</span>
                <FileUpload onFileUpload={(file) => handleFileUpload(client.id, 'loaDocUrl', file)} label="LOA and Cancellation Letter" fileUrl={client.loaDocUrl} />
              </div>
            </div>
          </div>
        ))}
        {filteredClients.length === 0 && (
          <div className="glass-morphism rounded-lg p-8 flex flex-col items-center justify-center text-center gap-4">
            <FileText className="h-8 w-8 mb-2 text-muted-foreground/50" />
            <p>No client data available for this month</p>
            <Button variant="link" onClick={addNewClient} className="w-full">
              Add your first client
            </Button>
          </div>
        )}
      </div>

    </div>
  );
};

export default ClientTable;
