import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';

export interface ClientSummary {
  name: string;
  location: string;
  totalPolicies: number;
  totalPremium: number;
}

interface ClientsSummaryTableProps {
  summaries: ClientSummary[];
  onDeleteClient?: (clientName: string) => void;
}

const ClientsSummaryTable: React.FC<ClientsSummaryTableProps> = ({ summaries, onDeleteClient }) => {
  const [clientToDelete, setClientToDelete] = React.useState<string | null>(null);

  return (
    <div className="glass-morphism rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-black/30">
          <TableRow>
            <TableHead className="text-left font-medium w-48 py-4">Client Name</TableHead>
            <TableHead className="text-left font-medium w-40">Location</TableHead>
            <TableHead className="text-left font-medium">Total Policies</TableHead>
            <TableHead className="text-left font-medium w-32">Total Premium</TableHead>
            <TableHead className="text-left font-medium w-16">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {summaries.map((client) => (
            <TableRow key={client.name + client.location}>
              <TableCell>{client.name}</TableCell>
              <TableCell>{client.location}</TableCell>
              <TableCell>{client.totalPolicies}</TableCell>
              <TableCell>R{client.totalPremium.toLocaleString()}</TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Client</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription>
                      Are you sure you want to delete {client.name}?
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDeleteClient?.(client.name)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientsSummaryTable;
