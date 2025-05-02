
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const UserProfile = () => {
  const { user, logout } = useAuth();
  
  return (
    <div className="flex flex-col">
      <div className="flex flex-col mb-2">
        <h2 className="text-2xl font-bold">Name Surname</h2>
        <div className="flex items-center">
          <div className="text-3xl font-bold tracking-wider">SKA<span className="text-primary/60">******</span></div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Logged in as: {user}
        </div>
        <Button variant="outline" size="sm" onClick={logout} className="flex items-center text-xs">
          <LogOut className="h-3 w-3 mr-1" /> Sign Out
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;
