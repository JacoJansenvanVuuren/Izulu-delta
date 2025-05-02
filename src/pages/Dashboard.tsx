
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
      policiesProducts: 3 + month,
      pdfSchedules: 'Schedule-AC-2024',
      pdfDocs: 'DOC-AC-001',
      policyNumbers: 'PLY-2024-001',
    },
    {
      id: '2',
      name: 'TechNova Solutions',
      policiesProducts: 2 + (month % 5),
      pdfSchedules: 'Schedule-TN-2024',
      pdfDocs: 'DOC-TN-002',
      policyNumbers: 'PLY-2024-002',
    },
    {
      id: '3',
      name: 'Global Industries',
      policiesProducts: 5 - (month % 3),
      pdfSchedules: 'Schedule-GI-2024',
      pdfDocs: 'DOC-GI-003',
      policyNumbers: 'PLY-2024-003',
    },
  ];
  
  // Add or remove clients based on month to simulate different data
  if (month % 3 === 0) {
    baseClients.push({
      id: '4',
      name: 'Marine Enterprises',
      policiesProducts: 4,
      pdfSchedules: 'Schedule-ME-2024',
      pdfDocs: 'DOC-ME-004',
      policyNumbers: 'PLY-2024-004',
    });
  }
  
  if (month % 2 === 0) {
    baseClients.push({
      id: '5',
      name: 'Delta Shipping',
      policiesProducts: 2,
      pdfSchedules: 'Schedule-DS-2024',
      pdfDocs: 'DOC-DS-005',
      policyNumbers: 'PLY-2024-005',
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
        
        <ClientTable clients={clients} />
      </div>
    </div>
  );
};

export default Dashboard;
