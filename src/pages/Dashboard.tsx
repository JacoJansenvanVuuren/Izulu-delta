import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  // Scroll position tracking
  const scrollPositionRef = useRef(0);
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const currentYear = new Date().getFullYear();
  const [clients, setClients] = useState<Client[] | null>(null);
  const [globalClients, setGlobalClients] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true); // Separate flag for initial load
  const [error, setError] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  // Cache for monthly clients: { ["month-year"]: Client[] }
  const [clientsCache, setClientsCache] = useState<Record<string, Client[]>>({});
  // Local deletion tracking
  const [deletedClientNames, setDeletedClientNames] = useState<Set<string>>(new Set());

  // Function to save scroll position
  const saveScrollPosition = useCallback(() => {
    scrollPositionRef.current = window.scrollY;
  }, []);

  // Function to restore scroll position
  const restoreScrollPosition = useCallback(() => {
    setTimeout(() => {
      window.scrollTo(0, scrollPositionRef.current);
    }, 0);
  }, []);

  // Modified setSelectedMonth to save scroll position
  const handleMonthChange = useCallback((newMonth: number) => {
    saveScrollPosition();
    setSelectedMonth(newMonth);
  }, [saveScrollPosition]);

  // Fetch clients for the selected month/year with cache
  useEffect(() => {
    const cacheKey = `${selectedMonth}-${currentYear}`;
    if (clientsCache[cacheKey]) {
      setClients(clientsCache[cacheKey]);
      if (initialLoading) setInitialLoading(false);
      // Fetch in background to update cache
      fetchMonthlyClients(selectedMonth, currentYear)
        .then(data => {
          // Filter out any clients that were deleted in the global view
          const filteredData = data.filter((client: any) => 
            !deletedClientNames.has(client.name)
          );
          
          // Map the data to ensure proper format for frontend
          const formattedData = filteredData.map((client: any) => ({
            ...client,
            policiesCount: client.policiescount || 0,
            policyPremium: client.policypremium || '',
            policyNumbers: client.policynumbers || [],
            scheduleDocsUrl: client.scheduledocsurl || [],
            pdfDocsUrl: client.pdfdocsurl || [],
            deductionDate: client.deductiondate || '',
            issueDate: client.issuedate || '',
            loaDocUrl: client.loadocurl || ''
          }));
          
          setClientsCache(prev => ({ ...prev, [cacheKey]: formattedData }));
          setClients(formattedData);
          restoreScrollPosition();
        })
        .catch(err => setError(err.message));
    } else {
      if (!initialLoading) setLoading(true);
      setError(null);
      fetchMonthlyClients(selectedMonth, currentYear)
        .then(data => {
          // Filter out any clients that were deleted in the global view
          const filteredData = data.filter((client: any) => 
            !deletedClientNames.has(client.name)
          );
          
          // Map the data to ensure proper format for frontend
          const formattedData = filteredData.map((client: any) => ({
            ...client,
            policiesCount: client.policiescount || 0,
            policyPremium: client.policypremium || '',
            policyNumbers: client.policynumbers || [],
            scheduleDocsUrl: client.scheduledocsurl || [],
            pdfDocsUrl: client.pdfdocsurl || [],
            deductionDate: client.deductiondate || '',
            issueDate: client.issuedate || '',
            loaDocUrl: client.loadocurl || ''
          }));
          
          setClientsCache(prev => ({ ...prev, [cacheKey]: formattedData }));
          setClients(formattedData);
          setInitialLoading(false);
          setLoading(false);
          restoreScrollPosition();
        })
        .catch(err => {
          setError(err.message);
          setInitialLoading(false);
          setLoading(false);
        });
    }
  }, [selectedMonth, currentYear, deletedClientNames, restoreScrollPosition]);

  // Fetch global clients for the summary view
  useEffect(() => {
    if (showSummary && (!globalClients || globalClients.length === 0)) {
      setLoading(true);
      fetchAllClients()
        .then(data => {
          console.log("Global clients fetched:", data);
          // Filter out any clients that were deleted
          const filteredData = data.filter((client: any) => 
            !deletedClientNames.has(client.name)
          );
          setGlobalClients(filteredData);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching global clients:", err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [showSummary, globalClients, deletedClientNames]);

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

  // Update clients after add/update/delete - now preserves scroll position
  const reloadClients = async (preserveScroll = true, optimisticUpdate?: Client) => {
    if (preserveScroll) {
      saveScrollPosition();
    }
    
    try {
      if (showSummary) {
        console.log("Reloading global clients");
        const data = await fetchAllClients();
        // Filter out any clients that were deleted
        const filteredData = data.filter((client: any) => 
          !deletedClientNames.has(client.name)
        );
        setGlobalClients(filteredData);
      } else {
        // If an optimistic update is provided, immediately update the local state
        if (optimisticUpdate && clients) {
          const updatedClients = clients.map(client => 
            client.id === optimisticUpdate.id ? optimisticUpdate : client
          );
          setClients(updatedClients);
          setClientsCache(prev => ({
            ...prev, 
            [`${selectedMonth}-${currentYear}`]: updatedClients
          }));
        }

        const data = await fetchMonthlyClients(selectedMonth, currentYear);
        // Filter out any clients that were deleted
        const filteredData = data.filter((client: any) => 
          !deletedClientNames.has(client.name)
        );
        
        // Map the data to ensure proper format for frontend
        const formattedData = filteredData.map((client: any) => ({
          ...client,
          policiesCount: client.policiescount || 0,
          policyPremium: client.policypremium || '',
          policyNumbers: client.policynumbers || [],
          scheduleDocsUrl: client.scheduledocsurl || [],
          pdfDocsUrl: client.pdfdocsurl || [],
          deductionDate: client.deductiondate || '',
          issueDate: client.issuedate || '',
          loaDocUrl: client.loadocurl || ''
        }));
        
        setClients(formattedData);
        setClientsCache(prev => ({ ...prev, [`${selectedMonth}-${currentYear}`]: formattedData }));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      if (preserveScroll) {
        restoreScrollPosition();
      }
    }
  };

  // Handle deleting a client from the global client table
  const handleDeleteGlobalClient = async (clientName: string) => {
    try {
      saveScrollPosition();
      await deleteClient(clientName);
      
      // Update local state immediately
      if (globalClients) {
        const updatedGlobalClients = globalClients.filter(client => client.name !== clientName);
        setGlobalClients(updatedGlobalClients);
      }
      
      // Track deleted client names to filter them from all views
      setDeletedClientNames(prev => new Set([...prev, clientName]));
      
      // Also update the cache for all months to remove this client
      const updatedCache: Record<string, Client[]> = {};
      Object.entries(clientsCache).forEach(([key, clientList]) => {
        updatedCache[key] = clientList.filter(client => client.name !== clientName);
      });
      setClientsCache(updatedCache);
      
      // If we're in monthly view, update the current clients list too
      if (clients) {
        const updatedClients = clients.filter(client => client.name !== clientName);
        setClients(updatedClients);
      }
      
      restoreScrollPosition();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Inline loading indicator for monthly view changes
  const inlineLoading = initialLoading && (
    <div className="flex justify-center items-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary/70" />
      <span className="ml-2 text-primary/70">Loading...</span>
    </div>
  );

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
            {!showSummary && <MonthSelector selectedMonth={selectedMonth} setSelectedMonth={handleMonthChange} />}
          </div>
          
          {/* Inline loading indicator */}
          {inlineLoading ? inlineLoading : error ? (
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
                    // Declare newClient outside try block
                    const newClient = {
                      ...client,
                      id: crypto.randomUUID(), // Temporary ID
                      policiesCount: client.policiesCount || 0,
                    };

                    try {
                      saveScrollPosition();
                      
                      // Immediately update local state
                      if (clients) {
                        const updatedClients = [...clients, newClient];
                        setClients(updatedClients);
                        setClientsCache(prev => ({
                          ...prev, 
                          [`${selectedMonth}-${currentYear}`]: updatedClients
                        }));
                      }

                      // Actual database operation
                      await addMonthlyClient(selectedMonth, currentYear, client);
                      await reloadClients(true);
                      if (cb) cb();
                    } catch (err: any) {
                      setError(err.message);
                      // Revert optimistic update
                      if (clients) {
                        const filteredClients = clients.filter(c => c.id !== newClient.id);
                        setClients(filteredClients);
                        setClientsCache(prev => ({
                          ...prev, 
                          [`${selectedMonth}-${currentYear}`]: filteredClients
                        }));
                      }
                      if (cb) cb(err.message);
                    }
                  }}
                  onUpdateClient={async (client, cb) => {
                    // Optimistic update immediately
                    const optimisticUpdateFn = () => {
                      if (clients) {
                        const updatedClients = clients.map(c => 
                          c.id === client.id ? { ...c, ...client } : c
                        );
                        setClients(updatedClients);
                        setClientsCache(prev => ({
                          ...prev, 
                          [`${selectedMonth}-${currentYear}`]: updatedClients
                        }));
                      }
                    };

                    try {
                      saveScrollPosition();
                      
                      // Perform optimistic update immediately
                      optimisticUpdateFn();

                      // Start database update in background
                      const updatePromise = updateMonthlyClient(selectedMonth, currentYear, client.id, client);

                      // Optional: add a timeout to prevent hanging
                      const timeoutPromise = new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Update timeout')), 5000)
                      );

                      // Race between update and timeout
                      const updatedServerClient = await Promise.race([
                        updatePromise,
                        timeoutPromise
                      ]);

                      if (cb) cb();
                    } catch (err: any) {
                      setError(err.message || 'Update failed');
                      
                      // Revert optimistic update
                      await reloadClients(true);
                      
                      if (cb) cb(err.message);
                    }
                  }}
                  onDeleteClient={async (id, cb) => {
                    // Find the client to be deleted for potential rollback
                    const clientToDelete = clients?.find(c => c.id === id);

                    try {
                      saveScrollPosition();

                      // Optimistic update
                      if (clients) {
                        const updatedClients = clients.filter(client => client.id !== id);
                        setClients(updatedClients);
                        setClientsCache(prev => ({
                          ...prev, 
                          [`${selectedMonth}-${currentYear}`]: updatedClients
                        }));
                      }

                      // Actual database operation
                      await deleteMonthlyClient(selectedMonth, currentYear, id);
                      await reloadClients(true);
                      if (cb) cb();
                    } catch (err: any) {
                      setError(err.message);
                      // Revert optimistic update
                      if (clientToDelete && clients) {
                        const updatedClients = [...clients, clientToDelete];
                        setClients(updatedClients);
                        setClientsCache(prev => ({
                          ...prev, 
                          [`${selectedMonth}-${currentYear}`]: updatedClients
                        }));
                      }
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
