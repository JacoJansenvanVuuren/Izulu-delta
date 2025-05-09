import React, { useState, useEffect } from 'react';
import ClientTable from '@/components/ClientTable';
import ClientsSummaryTable, { ClientSummary } from '@/components/ClientsSummaryTable';
import MonthSelector from '@/components/MonthSelector';
import UserProfile from '@/components/UserProfile';
import CompanyBadge from '@/components/CompanyBadge';
import { 
  fetchMonthlyClients, 
  addMonthlyClient, 
  updateMonthlyClient, 
  deleteMonthlyClient,
  fetchAllClients,
  deleteClient
} from '../utils/supabaseDashboard';
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from 'lucide-react';

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
  const [clients, setClients] = useState<Client[] | null>(null);
  const [globalClients, setGlobalClients] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  // Cache for monthly clients: { ["month-year"]: Client[] }
  const [clientsCache, setClientsCache] = useState<Record<string, Client[]>>({});

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

  // Fetch global clients for the summary view
  useEffect(() => {
    if (showSummary) {
      setLoading(true);
      fetchAllClients()
        .then(data => {
          console.log("Global clients fetched:", data);
          setGlobalClients(data);
        })
        .catch(err => {
          console.error("Error fetching global clients:", err);
          setError(err.message);
        })
        .finally(() => setLoading(false));
    }
  }, [showSummary]);

  // Summary logic (aggregate by name/location)
  const summaryMap = new Map();
  const clientSummaries = (() => {
    if (!globalClients || globalClients.length === 0) return [];
    
    globalClients.forEach(client => {
      const key = `${client.name}||${client.location}`;
      const premium = client.policy_premium || 0;
      
      if (!summaryMap.has(key)) {
        summaryMap.set(key, {
          name: client.name,
          location: client.location || '',
          totalPolicies: client.policies_count || 0,
          totalPremium: premium,
        });
      }
    });
    
    return Array.from(summaryMap.values());
  })();

  // Update clients after add/update/delete
  const reloadClients = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (showSummary) {
        console.log("Reloading global clients");
        const data = await fetchAllClients();
        setGlobalClients(data);
      } else {
        const data = await fetchMonthlyClients(selectedMonth, currentYear);
        setClients(data);
        setClientsCache(prev => ({ ...prev, [`${selectedMonth}-${currentYear}`]: data }));
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a client from the global client table
  const handleDeleteGlobalClient = async (clientName: string) => {
    try {
      setLoading(true);
      await deleteClient(clientName);
      toast({
        title: "Client Deleted",
        description: `${clientName} has been removed from all records`,
      });
      reloadClients();
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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
              {showSummary ? 'Global Clients Table' : 'Monthly Tracking'}
            </h1>
            {!showSummary && <MonthSelector selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />}
          </div>
          
          {/* Inline loading indicator */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
              <span className="ml-2 text-primary/70">Loading...</span>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">Error: {error}</div>
          ) : (
            <>
              {/* Stats cards */}
              {!showSummary && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="glass-morphism rounded-lg p-4">
                    <h3 className="text-muted-foreground text-sm mb-1">Total Clients</h3>
                    <p className="text-2xl font-bold">{clients?.length || 0}</p>
                  </div>
                  <div className="glass-morphism rounded-lg p-4">
                    <h3 className="text-muted-foreground text-sm mb-1">Total Policies</h3>
                    <p className="text-2xl font-bold">{clients?.reduce((sum, client) => sum + (Number(client.policiesCount) || 0), 0) || 0}</p>
                  </div>
                  <div className="glass-morphism rounded-lg p-4">
                    <h3 className="text-muted-foreground text-sm mb-1">Total Premium</h3>
                    <p className="text-2xl font-bold">R{clients?.reduce((sum, client) => {
                      const premium = ((client.policyPremium || '')).replace(/[^0-9.]/g, '');
                      const premiumNum = parseFloat(premium);
                      return sum + (isNaN(premiumNum) ? 0 : premiumNum);
                    }, 0).toLocaleString()}</p>
                  </div>
                  <div className="glass-morphism rounded-lg p-4">
                    <h3 className="text-muted-foreground text-sm mb-1">Active Products</h3>
                    <p className="text-2xl font-bold">{new Set(clients?.flatMap(client => 
                      Array.isArray(client.products) ? client.products : []
                    ) || []).size}</p>
                  </div>
                </div>
              )}
              
              {/* Client table with improved styling */}
              {!showSummary ? (
                <ClientTable
                  initialClients={clients || []}
                  onAddClient={async (client, cb) => {
                    try {
                      await addMonthlyClient(selectedMonth, currentYear, client);
                      reloadClients();
                      if (cb) cb();
                      
                      toast({
                        title: "Client Added",
                        description: "New client has been added successfully",
                      });
                    } catch (err: any) {
                      setError(err.message);
                      toast({
                        title: "Error",
                        description: err.message,
                        variant: "destructive"
                      });
                      if (cb) cb(err.message);
                    }
                  }}
                  onUpdateClient={async (client, cb) => {
                    try {
                      await updateMonthlyClient(selectedMonth, currentYear, client.id, client);
                      reloadClients();
                      if (cb) cb();
                      
                      toast({
                        title: "Client Updated",
                        description: "Client information has been updated",
                      });
                    } catch (err: any) {
                      setError(err.message);
                      toast({
                        title: "Error",
                        description: err.message,
                        variant: "destructive"
                      });
                      if (cb) cb(err.message);
                    }
                  }}
                  onDeleteClient={async (id, cb) => {
                    try {
                      await deleteMonthlyClient(selectedMonth, currentYear, id);
                      reloadClients();
                      if (cb) cb();
                      
                      toast({
                        title: "Client Deleted",
                        description: "Client has been removed successfully",
                      });
                    } catch (err: any) {
                      setError(err.message);
                      toast({
                        title: "Error",
                        description: err.message,
                        variant: "destructive"
                      });
                      if (cb) cb(err.message);
                    }
                  }}
                  selectedMonth={selectedMonth}
                  currentYear={currentYear}
                />
              ) : (
                <ClientsSummaryTable 
                  summaries={clientSummaries}
                  onDeleteClient={handleDeleteGlobalClient}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
