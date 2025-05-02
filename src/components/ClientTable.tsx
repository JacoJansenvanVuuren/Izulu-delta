
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Client {
  id: string;
  name: string;
  policiesProducts: number;
  pdfSchedules: string;
  pdfDocs: string;
  policyNumbers: string;
}

interface ClientTableProps {
  clients: Client[];
}

const ClientTable = ({ clients }: ClientTableProps) => {
  return (
    <div className="glass-morphism rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-black/20">
          <TableRow>
            <TableHead className="text-left w-1/5 font-medium">Client Name</TableHead>
            <TableHead className="text-left w-1/5 font-medium">Number of Policies & Products</TableHead>
            <TableHead className="text-left w-1/5 font-medium">PDF Schedules</TableHead>
            <TableHead className="text-left w-1/5 font-medium">PDF DOC's</TableHead>
            <TableHead className="text-left w-1/5 font-medium">Policy Numbers</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id} className="border-t border-white/5 hover:bg-white/5">
              <TableCell className="font-medium">{client.name}</TableCell>
              <TableCell>{client.policiesProducts}</TableCell>
              <TableCell>{client.pdfSchedules}</TableCell>
              <TableCell>{client.pdfDocs}</TableCell>
              <TableCell>{client.policyNumbers}</TableCell>
            </TableRow>
          ))}
          {clients.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                No client data available for this month
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientTable;
