
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

  const handleDeleteConfirm = () => {
    if (clientToDelete && onDeleteClient) {
      onDeleteClient(clientToDelete);
      setClientToDelete(null);
    }
  };

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
          {summaries.length > 0 ? (
            summaries.map((client) => (
              <TableRow key={client.name + client.location}>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.location}</TableCell>
                <TableCell>{client.totalPolicies}</TableCell>
                <TableCell>R{client.totalPremium.toLocaleString()}</TableCell>
                <TableCell>
                  {onDeleteClient && (
                    <button 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => setClientToDelete(client.name)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No clients found. Add clients in the monthly view.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!clientToDelete} onOpenChange={(open) => !open && setClientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to delete {clientToDelete}? This will remove the client from ALL months.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientsSummaryTable;
