import React from 'react';

interface ClientSummaryButtonProps {
  onClick: () => void;
  isSummary: boolean;
}

const ClientSummaryButton: React.FC<ClientSummaryButtonProps> = ({ onClick, isSummary }) => (
  <button
    className={`px-4 py-2 rounded font-semibold shadow transition bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary ${isSummary ? 'ring-2 ring-primary' : ''}`}
    onClick={onClick}
    type="button"
  >
    {isSummary ? 'Show Monthly Dashboard' : 'Show Clients Table'}
  </button>
);

export default ClientSummaryButton;
