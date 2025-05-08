import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export interface ClientSummary {
  name: string;
  location: string;
  totalPolicies: number;
  totalPremium: number;
}

interface ClientsSummaryTableProps {
  summaries: ClientSummary[];
}

const ClientsSummaryTable: React.FC<ClientsSummaryTableProps> = ({ summaries }) => (
  <div className="glass-morphism rounded-lg overflow-hidden">
    <Table>
      <TableHeader className="bg-black/30">
        <TableRow>
          <TableHead className="text-left font-medium w-48 py-4">Client Name</TableHead>
          <TableHead className="text-left font-medium w-40">Location</TableHead>
          <TableHead className="text-left font-medium">Total Policies</TableHead>
          <TableHead className="text-left font-medium w-32">Total Premium</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {summaries.map((client) => (
          <TableRow key={client.name + client.location}>
            <TableCell>{client.name}</TableCell>
            <TableCell>{client.location}</TableCell>
            <TableCell>{client.totalPolicies}</TableCell>
            <TableCell>R{client.totalPremium.toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export default ClientsSummaryTable;
