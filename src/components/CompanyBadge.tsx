
import React from 'react';

const CompanyBadge = () => {
  return (
    <div className="flex items-center">
      <div className="mr-4">
        <h2 className="text-3xl font-bold">IZULU</h2>
        <h3 className="text-2xl font-bold">DELTA</h3>
      </div>
      <div className="border-2 border-white/20 rounded-lg p-3 transform rotate-45">
        <div className="transform -rotate-45">
          <div className="text-sm font-medium">Marine</div>
          <div className="text-sm font-medium">Army</div>
          <div className="text-sm font-medium">Soldier</div>
        </div>
      </div>
    </div>
  );
};

export default CompanyBadge;
