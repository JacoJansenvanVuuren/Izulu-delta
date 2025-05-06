
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const UserProfile = () => {
  const { logout } = useAuth();
  
  return (
    <div className="flex items-center">
      <Avatar className="h-16 w-16 border-2 border-primary/20">
        <AvatarImage src="/lemley-photo.jpg" alt="Lemley Mulder" />
        <AvatarFallback className="bg-primary/10 text-primary">LM</AvatarFallback>
      </Avatar>
      
      <div className="ml-4 flex-1">
        <h2 className="text-2xl font-bold text-gradient">Lemley Mulder</h2>
      </div>
      
      <div className="flex items-center">
        <Button variant="outline" size="sm" onClick={logout} className="flex items-center text-xs">
          <LogOut className="h-3 w-3 mr-1" /> Sign Out
        </Button>
      </div>
    </div>
  );
};

export default UserProfile;
