
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const UserProfile = () => {
  const { logout } = useAuth();
  
  return (
    <div className="flex flex-col">
      <div className="flex flex-col mb-2">
        <h2 className="text-2xl font-bold">Lemley Mulder</h2>
      </div>
      
      <div className="flex items-center justify-end mt-4">
        <Button variant="outline" size="sm" onClick={logout} className="flex items-center text-xs">
          <LogOut className="h-3 w-3 mr-1" /> Sign Out
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;
