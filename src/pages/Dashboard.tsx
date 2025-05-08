import React, { useState, useEffect } from 'react';
import ClientTable from '@/components/ClientTable';
import ClientsSummaryTable, { ClientSummary } from '@/components/ClientsSummaryTable';
import ClientSummaryButton from '@/components/ClientSummaryButton';
import MonthSelector from '@/components/MonthSelector';
import UserProfile from '@/components/UserProfile';
import CompanyBadge from '@/components/CompanyBadge';
import { 
  fetchMonthlyClients, 
  addMonthlyClient, 
  updateMonthlyClient, 
  deleteMonthlyClient 
} from '../utils/supabaseDashboard';

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

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const currentYear = new Date().getFullYear();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  // Cache for monthly clients: { ["month-year"]: Client[] }
  const [clientsCache, setClientsCache] = useState({});

  // Fetch clients for the selected month/year with cache
  useEffect(() => {
    const cacheKey = `${selectedMonth}-${currentYear}`;
    if (clientsCache[cacheKey]) {
      setClients(clientsCache[cacheKey]);
      setLoading(false);
      // Fetch in background to update cache
      fetchMonthlyClients(selectedMonth, currentYear)
        .then(data => {
          setClientsCache(prev => ({ ...prev, [cacheKey]: data }));
          setClients(data);
        })
        .catch(err => setError(err.message));
    } else {
      setLoading(true);
      setError(null);
      fetchMonthlyClients(selectedMonth, currentYear)
        .then(data => {
          setClientsCache(prev => ({ ...prev, [cacheKey]: data }));
          setClients(data);
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [selectedMonth, currentYear]);

  // Summary logic (aggregate by name/location)
  const summaryMap = new Map();
  clients.forEach(client => {
    const key = `${client.name}||${client.location}`;
    const premium = parseFloat(((client.policyPremium || client.policypremium || '').replace(/[^0-9.]/g, ''))) || 0;
    if (!summaryMap.has(key)) {
      summaryMap.set(key, {
        name: client.name,
        location: client.location,
        totalPolicies: client.policiesCount || 0,
        totalPremium: premium,
      });
    } else {
      const entry = summaryMap.get(key);
      entry.totalPolicies += client.policiesCount || 0;
      entry.totalPremium += premium;
    }
  });
  const clientSummaries = Array.from(summaryMap.values());

  // Update clients after add/update/delete
  const reloadClients = () => {
    setLoading(true);
    setError(null);
    fetchMonthlyClients(selectedMonth, currentYear)
      .then(data => setClients(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  // UI for loading and error
  if (loading) return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(15, 23, 42, 0.4)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
      transition: 'background 0.3s',
    }}>
      <div style={{
        width: 64,
        height: 64,
        border: '8px solid #fff',
        borderTop: '8px solid #6366f1',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        boxShadow: '0 2px 24px #6366f1cc',
        background: 'rgba(255,255,255,0.03)'
      }} />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
    </div>
  );
  if (error) return <div style={{padding: 40, color: 'red', textAlign: 'center'}}>Error: {error}</div>;

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
                    const premium = ((client.policyPremium || client.policypremium || '')).replace(/[^0-9.]/g, '');
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
                onAddClient={async (client, cb) => {
                  try {
                    setLoading(true);
                    setError(null);
                    await addMonthlyClient(selectedMonth, currentYear, client);
                    reloadClients();
                    if (cb) cb();
                  } catch (err) {
                    setError(err.message);
                    if (cb) cb(err);
                  } finally {
                    setLoading(false);
                  }
                }}
                onUpdateClient={async (client, cb) => {
                  try {
                    setLoading(true);
                    setError(null);
                    await updateMonthlyClient(selectedMonth, currentYear, client.id, client);
                    reloadClients();
                    if (cb) cb();
                  } catch (err) {
                    setError(err.message);
                    if (cb) cb(err);
                  } finally {
                    setLoading(false);
                  }
                }}
                onDeleteClient={async (id, cb) => {
                  try {
                    setLoading(true);
                    setError(null);
                    await deleteMonthlyClient(selectedMonth, currentYear, id);
                    reloadClients();
                    if (cb) cb();
                  } catch (err) {
                    setError(err.message);
                    if (cb) cb(err);
                  } finally {
                    setLoading(false);
                  }
                }}
              />
            </>
          )}
          {showSummary && (
            <ClientsSummaryTable 
              summaries={clientSummaries}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
