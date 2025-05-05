
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ClientTable from '@/components/ClientTable';
import MonthSelector from '@/components/MonthSelector';
import UserProfile from '@/components/UserProfile';
import CompanyBadge from '@/components/CompanyBadge';

// Mock client data for each month
const generateMockData = (month: number) => {
  // Generate different data for each month
  const baseClients = [
    {
      id: '1',
      name: 'Acme Corporation',
      policiesCount: 3 + month,
      products: 'Life Insurance, Health Insurance',
      scheduleDocsUrl: 'mock-url-for-schedule-ac-2024.pdf',
      pdfDocsUrl: 'mock-url-for-doc-ac-001.pdf',
      policyNumbers: 'PLY-2024-001',
      issueDate: '2024-01-15',
      deductionDate: '2024-02-01',
      loaDocUrl: 'mock-url-for-loa-ac-001.pdf',
      policyPremium: '$1,500',
    },
    {
      id: '2',
      name: 'TechNova Solutions',
      policiesCount: 2 + (month % 5),
      products: 'Health Insurance, Property Insurance',
      scheduleDocsUrl: 'mock-url-for-schedule-tn-2024.pdf',
      pdfDocsUrl: 'mock-url-for-doc-tn-002.pdf',
      policyNumbers: 'PLY-2024-002',
      issueDate: '2024-02-10',
      deductionDate: '2024-03-01',
      loaDocUrl: 'mock-url-for-loa-tn-002.pdf',
      policyPremium: '$2,200',
    },
    {
      id: '3',
      name: 'Global Industries',
      policiesCount: 5 - (month % 3),
      products: 'Vehicle Insurance, Business Liability',
      scheduleDocsUrl: 'mock-url-for-schedule-gi-2024.pdf',
      pdfDocsUrl: 'mock-url-for-doc-gi-003.pdf',
      policyNumbers: 'PLY-2024-003',
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
      policiesCount: 4,
      products: 'Marine Insurance, Property Insurance',
      scheduleDocsUrl: 'mock-url-for-schedule-me-2024.pdf',
      pdfDocsUrl: 'mock-url-for-doc-me-004.pdf',
      policyNumbers: 'PLY-2024-004',
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
      policiesCount: 2,
      products: 'Cargo Insurance, Liability Insurance',
      scheduleDocsUrl: 'mock-url-for-schedule-ds-2024.pdf',
      pdfDocsUrl: 'mock-url-for-doc-ds-005.pdf',
      policyNumbers: 'PLY-2024-005',
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
  const [clients, setClients] = useState(generateMockData(selectedMonth));

  useEffect(() => {
    setClients(generateMockData(selectedMonth));
  }, [selectedMonth]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <UserProfile />
          <div className="flex justify-end">
            <CompanyBadge />
          </div>
        </div>
        
        <MonthSelector
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />
        
        <ClientTable initialClients={clients} />
      </div>
    </div>
  );
};

export default Dashboard;
