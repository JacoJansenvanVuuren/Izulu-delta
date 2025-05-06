
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ClientTable from '@/components/ClientTable';
import ClientsSummaryTable, { ClientSummary } from '@/components/ClientsSummaryTable';
import ClientSummaryButton from '@/components/ClientSummaryButton';
import MonthSelector from '@/components/MonthSelector';
import UserProfile from '@/components/UserProfile';
import CompanyBadge from '@/components/CompanyBadge';

// Define Client interface (matching the one in ClientTable.tsx)
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

// Mock client data for each month
const generateMockData = (month: number): Client[] => {
  // Generate different data for each month
  const baseClients: Client[] = [
    {
      id: '1',
      name: 'Acme Corporation',
      location: 'New York',
      policiesCount: 3 + month,
      products: ['Life Insurance', 'Health Insurance'],
      scheduleDocsUrl: ['mock-url-for-schedule-ac-2024.pdf'],
      pdfDocsUrl: ['mock-url-for-doc-ac-001.pdf'],
      policyNumbers: ['PLY-2024-001'],
      issueDate: '2024-01-15',
      deductionDate: '2024-02-01',
      loaDocUrl: 'mock-url-for-loa-ac-001.pdf',
      policyPremium: '$1,500',
    },
    {
      id: '2',
      name: 'TechNova Solutions',
      location: 'San Francisco',
      policiesCount: 2 + (month % 5),
      products: ['Health Insurance', 'Property Insurance'],
      scheduleDocsUrl: ['mock-url-for-schedule-tn-2024.pdf'],
      pdfDocsUrl: ['mock-url-for-doc-tn-002.pdf'],
      policyNumbers: ['PLY-2024-002'],
      issueDate: '2024-02-10',
      deductionDate: '2024-03-01',
      loaDocUrl: 'mock-url-for-loa-tn-002.pdf',
      policyPremium: '$2,200',
    },
    {
      id: '3',
      name: 'Global Industries',
      location: 'London',
      policiesCount: 5 - (month % 3),
      products: ['Vehicle Insurance', 'Business Liability'],
      scheduleDocsUrl: ['mock-url-for-schedule-gi-2024.pdf'],
      pdfDocsUrl: ['mock-url-for-doc-gi-003.pdf'],
      policyNumbers: ['PLY-2024-003'],
      issueDate: '2024-03-05',
      deductionDate: '2024-04-01',
      loaDocUrl: 'mock-url-for-loa-gi-003.pdf',
      policyPremium: '$3,750',
    },
  ];
  
  // Add or remove clients based on month to simulate different data
  if (month % 3 === 0) {
    baseClients.push({
      id: '4',
      name: 'Marine Enterprises',
      location: 'Cape Town',
      policiesCount: 4,
      products: ['Marine Insurance', 'Property Insurance'],
      scheduleDocsUrl: ['mock-url-for-schedule-me-2024.pdf'],
      pdfDocsUrl: ['mock-url-for-doc-me-004.pdf'],
      policyNumbers: ['PLY-2024-004'],
      issueDate: '2024-01-20',
      deductionDate: '2024-02-15',
      loaDocUrl: 'mock-url-for-loa-me-004.pdf',
      policyPremium: '$4,300',
    });
  }
  
  if (month % 2 === 0) {
    baseClients.push({
      id: '5',
      name: 'Delta Shipping',
      location: 'Rotterdam',
      policiesCount: 2,
      products: ['Cargo Insurance', 'Liability Insurance'],
      scheduleDocsUrl: ['mock-url-for-schedule-ds-2024.pdf'],
      pdfDocsUrl: ['mock-url-for-doc-ds-005.pdf'],
      policyNumbers: ['PLY-2024-005'],
      issueDate: '2024-02-25',
      deductionDate: '2024-03-15',
      loaDocUrl: 'mock-url-for-loa-ds-005.pdf',
      policyPremium: '$2,900',
    });
  }
  
  return baseClients;
};

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  // Store clients for each month separately
  const [clientsByMonth, setClientsByMonth] = useState<Record<number, Client[]>>(() => {
    // Initialize with data for all months
    const initialData: Record<number, Client[]> = {};
    for (let i = 0; i < 12; i++) {
      initialData[i] = generateMockData(i);
    }
    return initialData;
  });

  // Get current month's clients
  const clients = clientsByMonth[selectedMonth] || [];

  // Toggle between dashboards
  const [showSummary, setShowSummary] = useState(false);

  // Aggregate all clients across months for summary
  const allClients = Object.values(clientsByMonth).flat();
  const summaryMap = new Map<string, ClientSummary>();
  allClients.forEach(client => {
    const key = `${client.name}||${client.location}`;
    const premium = parseFloat((client.policyPremium || '').replace(/[^0-9.]/g, '')) || 0;
    if (!summaryMap.has(key)) {
      summaryMap.set(key, {
        name: client.name,
        location: client.location,
        totalPolicies: client.policiesCount || 0,
        totalPremium: premium,
      });
    } else {
      const entry = summaryMap.get(key)!;
      entry.totalPolicies += client.policiesCount || 0;
      entry.totalPremium += premium;
    }
  });
  const clientSummaries = Array.from(summaryMap.values());

  // Update clients for the current month only
  const updateClientsForCurrentMonth = (updatedClients: Client[]) => {
    setClientsByMonth(prev => ({
      ...prev,
      [selectedMonth]: updatedClients
    }));
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <>

      <div className="min-h-screen bg-gradient-to-b from-background to-black/80 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header with improved layout */}
          <div className="glass-morphism rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <UserProfile onToggleDashboard={() => setShowSummary(s => !s)} isSummary={showSummary} />
              <div className="flex justify-end items-center">
                <CompanyBadge />
              </div>
            </div>
          </div>
          {/* Dashboard switch button */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gradient mb-4 md:mb-0">
              {showSummary ? 'Clients Summary Table' : 'Monthly Tracking'}
            </h1>
            {!showSummary && <MonthSelector selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />}
          </div>
          {/* Stats cards */}
          {!showSummary && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="glass-morphism rounded-lg p-4">
                  <h3 className="text-muted-foreground text-sm mb-1">Total Clients</h3>
                  <p className="text-2xl font-bold">{clients.length}</p>
                </div>
                <div className="glass-morphism rounded-lg p-4">
                  <h3 className="text-muted-foreground text-sm mb-1">Total Policies</h3>
                  <p className="text-2xl font-bold">{clients.reduce((sum, client) => sum + client.policiesCount, 0)}</p>
                </div>
                <div className="glass-morphism rounded-lg p-4">
                  <h3 className="text-muted-foreground text-sm mb-1">Total Premium</h3>
                  <p className="text-2xl font-bold">R{clients.reduce((sum, client) => {
                    const premium = client.policyPremium.replace(/[^0-9.]/g, '');
                    return sum + (parseFloat(premium) || 0);
                  }, 0).toLocaleString()}</p>
                </div>
                <div className="glass-morphism rounded-lg p-4">
                  <h3 className="text-muted-foreground text-sm mb-1">Active Products</h3>
                  <p className="text-2xl font-bold">{new Set(clients.flatMap(client => 
                    Array.isArray(client.products) ? client.products : []
                  )).size}</p>
                </div>
              </div>
              {/* Client table with improved styling */}
              <ClientTable 
                initialClients={clients} 
                onClientsChange={updateClientsForCurrentMonth} 
              />
            </>
          )}
          {showSummary && (
            <ClientsSummaryTable summaries={clientSummaries} />
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
