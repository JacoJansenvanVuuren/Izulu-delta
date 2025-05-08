
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ClientTable from '@/components/ClientTable';
import ClientsSummaryTable from '@/components/ClientsSummaryTable';
import MonthSelector from '@/components/MonthSelector';
import UserProfile from '@/components/UserProfile';
import CompanyBadge from '@/components/CompanyBadge';
import { ClientData } from '@/types/clients';
import { 
  getClientDataByMonth, 
  getClientSummaries, 
  saveClientData, 
  deleteClientData, 
  deleteAllClients 
} from '@/services/clientService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [clientsByMonth, setClientsByMonth] = useState<Record<number, ClientData[]>>({});
  const [clientSummaries, setClientSummaries] = useState<Array<{
    name: string;
    location: string;
    totalPolicies: number;
    totalPremium: number;
  }>>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const currentYear = new Date().getFullYear();

  // Fetch client data for the selected month
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (!clientsByMonth[selectedMonth]) {
          const data = await getClientDataByMonth(selectedMonth, currentYear);
          setClientsByMonth(prev => ({
            ...prev,
            [selectedMonth]: data
          }));
        }
        
        if (showSummary && clientSummaries.length === 0) {
          const summaries = await getClientSummaries();
          setClientSummaries(summaries);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load client data',
          variant: 'destructive'
        });
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedMonth, showSummary, clientsByMonth, clientSummaries.length, toast, currentYear]);

  // Update clients for the current month only
  const updateClientsForCurrentMonth = async (updatedClients: ClientData[]) => {
    try {
      // Get current clients to compare
      const currentClients = clientsByMonth[selectedMonth] || [];
      
      // Find clients to add or update
      for (const updatedClient of updatedClients) {
        // Save client for the current month only
        await saveClientData(updatedClient, selectedMonth, currentYear);
      }
      
      // Find clients to delete (in current month's data but not in updated data)
      const updatedClientIds = new Set(updatedClients.map(c => c.id));
      for (const currentClient of currentClients) {
        if (!updatedClientIds.has(currentClient.id)) {
          // Delete client from the current month only
          await deleteClientData(currentClient.id, selectedMonth, currentYear);
        }
      }
      
      // Update state with the new client list for the current month only
      setClientsByMonth(prev => ({
        ...prev,
        [selectedMonth]: updatedClients
      }));
      
      // If showing summary, refresh it to reflect the latest changes
      if (showSummary) {
        const summaries = await getClientSummaries();
        setClientSummaries(summaries);
      }
      
      toast({
        title: 'Success',
        description: 'Client data saved successfully',
      });
    } catch (error) {
      console.error('Error updating clients:', error);
      toast({
        title: 'Error',
        description: 'Failed to save client data',
        variant: 'destructive'
      });
    }
  };

  // Handle switching between monthly and summary views
  const toggleDashboard = async () => {
    const newShowSummary = !showSummary;
    setShowSummary(newShowSummary);
    
    try {
      if (newShowSummary && clientSummaries.length === 0) {
        const summaries = await getClientSummaries();
        setClientSummaries(summaries);
      }
    } catch (error) {
      console.error('Error fetching summaries:', error);
      toast({
        title: 'Error',
        description: 'Failed to load client summaries',
        variant: 'destructive'
      });
    }
  };

  // Handle deleting all clients
  const handleDeleteAllClients = async () => {
    try {
      if (window.confirm('Are you sure you want to delete ALL clients? This action cannot be undone.')) {
        setLoading(true);
        await deleteAllClients();
        
        // Clear local state
        setClientsByMonth({});
        setClientSummaries([]);
        
        toast({
          title: 'Success',
          description: 'All clients have been deleted',
        });
        setLoading(false);
      }
    } catch (error) {
      console.error('Error deleting all clients:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete clients',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Get current month's clients
  const clients = clientsByMonth[selectedMonth] || [];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background to-black/80 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header with improved layout */}
          <div className="glass-morphism rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <UserProfile onToggleDashboard={toggleDashboard} isSummary={showSummary} />
              <div className="flex justify-end items-center">
                <CompanyBadge />
              </div>
            </div>
          </div>
          
          {/* Dashboard switch button and delete all clients button */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gradient mb-4 md:mb-0">
              {showSummary ? 'Clients Summary Table' : 'Monthly Tracking'}
            </h1>
            
            <div className="flex flex-wrap gap-4 items-center">
              {!showSummary && <MonthSelector selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />}
              <Button
                onClick={handleDeleteAllClients}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete All Clients
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="glass-morphism rounded-lg p-12 flex justify-center items-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-8 w-32 bg-primary/20 rounded mb-4"></div>
                <div className="text-muted-foreground">Loading client data...</div>
              </div>
            </div>
          ) : (
            <>
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
                    selectedMonth={selectedMonth}
                    currentYear={currentYear}
                  />
                </>
              )}
              
              {showSummary && (
                <ClientsSummaryTable summaries={clientSummaries} />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
