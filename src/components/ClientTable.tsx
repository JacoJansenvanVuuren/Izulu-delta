
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FileUpload from '@/components/FileUpload';
import MultiFileUpload from '@/components/MultiFileUpload';
import MultiEntryField from '@/components/MultiEntryField';
import { Plus } from 'lucide-react';

interface Client {
  id: string;
  name: string;
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
}

const ClientTable = ({ initialClients }: ClientTableProps) => {
  // Convert string products and policyNumbers to arrays for existing clients
  const formattedInitialClients = initialClients.map(client => ({
    ...client,
    products: Array.isArray(client.products) ? client.products : client.products.split(', '),
    policyNumbers: Array.isArray(client.policyNumbers) ? client.policyNumbers : [client.policyNumbers],
    scheduleDocsUrl: Array.isArray(client.scheduleDocsUrl) ? client.scheduleDocsUrl : client.scheduleDocsUrl ? [client.scheduleDocsUrl] : [],
    pdfDocsUrl: Array.isArray(client.pdfDocsUrl) ? client.pdfDocsUrl : client.pdfDocsUrl ? [client.pdfDocsUrl] : []
  }));

  const [clients, setClients] = useState<Client[]>(formattedInitialClients);

  // In a real app, this would interact with your storage solution
  const handleFileUpload = (clientId: string, field: 'loaDocUrl', file: File) => {
    // This is a mock implementation since we can't actually upload files without a backend
    // In a real app, you would upload to a storage provider and get a URL back
    const mockUrl = `mock-url-for-${file.name}`;

    setClients(prevClients => 
      prevClients.map(client => 
        client.id === clientId 
          ? { ...client, [field]: mockUrl } 
          : client
      )
    );
  };

  const handleMultiFileUpload = (clientId: string, field: 'scheduleDocsUrl' | 'pdfDocsUrl', file: File) => {
    // Create a mock URL for this file
    const mockUrl = `mock-url-for-${file.name}`;

    setClients(prevClients => 
      prevClients.map(client => 
        client.id === clientId 
          ? { 
              ...client, 
              [field]: [...(client[field] || []), mockUrl]
            } 
          : client
      )
    );
  };

  const removeFile = (clientId: string, field: 'scheduleDocsUrl' | 'pdfDocsUrl', index: number) => {
    setClients(prevClients => 
      prevClients.map(client => 
        client.id === clientId 
          ? { 
              ...client, 
              [field]: client[field]?.filter((_, i) => i !== index) || [] 
            } 
          : client
      )
    );
  };

  const updateMultiEntryField = (clientId: string, field: 'products' | 'policyNumbers', values: string[]) => {
    setClients(prevClients => 
      prevClients.map(client => 
        client.id === clientId 
          ? { ...client, [field]: values } 
          : client
      )
    );
  };

  const addNewClient = () => {
    const newClient: Client = {
      id: `client-${Date.now()}`,
      name: '',
      policiesCount: 0,
      products: [],
      policyNumbers: [],
      scheduleDocsUrl: [],
      pdfDocsUrl: [],
      issueDate: '',
      deductionDate: '',
      policyPremium: '',
    };

    setClients([...clients, newClient]);
  };

  const updateClientField = (clientId: string, field: keyof Client, value: string | number) => {
    setClients(prevClients => 
      prevClients.map(client => 
        client.id === clientId 
          ? { ...client, [field]: value } 
          : client
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="glass-morphism rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-black/20">
            <TableRow>
              <TableHead className="text-left font-medium w-48">Client Name</TableHead>
              <TableHead className="text-left font-medium">Number of Policies</TableHead>
              <TableHead className="text-left font-medium w-48">Products</TableHead>
              <TableHead className="text-left font-medium">Schedule docs</TableHead>
              <TableHead className="text-left font-medium">PDF DOC's</TableHead>
              <TableHead className="text-left font-medium w-48">Policy Numbers</TableHead>
              <TableHead className="text-left font-medium">Issue date</TableHead>
              <TableHead className="text-left font-medium">Deduction date</TableHead>
              <TableHead className="text-left font-medium">LOA and cancellation</TableHead>
              <TableHead className="text-left font-medium">Policy premium</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
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
                  <Input 
                    value={client.policyPremium} 
                    onChange={(e) => updateClientField(client.id, 'policyPremium', e.target.value)}
                    className="bg-transparent border-white/10" 
                  />
                </TableCell>
              </TableRow>
            ))}
            {clients.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-6 text-muted-foreground">
                  No client data available for this month
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={addNewClient}>
          <Plus className="h-4 w-4 mr-2" /> Add New Client
        </Button>
      </div>
    </div>
  );
};

export default ClientTable;
