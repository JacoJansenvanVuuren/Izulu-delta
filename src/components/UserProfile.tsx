
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import ClientSummaryButton from './ClientSummaryButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserProfileProps {
  onToggleDashboard: () => void;
  isSummary: boolean;
}

const UserProfile = ({ onToggleDashboard, isSummary }: UserProfileProps) => {
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
        <ClientSummaryButton onClick={onToggleDashboard} isSummary={isSummary} />
      </div>
    </div>
  );
};

export default UserProfile;
