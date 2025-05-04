
import React from 'react';

const CompanyBadge = () => {
  return (
    <div className="flex items-center">
      <div className="mr-4">
        <h2 className="text-3xl font-bold">IZULU</h2>
        <h3 className="text-2xl font-bold">DELTA</h3>
      </div>
      <div className="relative w-24 h-24">
        {/* Circle */}
        <div className="absolute top-0 left-0 w-full h-full border-2 border-white/20 rounded-full"></div>
        
        {/* Diamond/Square */}
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="w-[85%] h-[85%] border-2 border-white/20 transform rotate-45 overflow-hidden flex items-center justify-center">
            {/* Character Image */}
            <img 
              src="/lovable-uploads/f6f26c0d-1468-4182-9c75-9b0f680a3f69.png" 
              alt="Soldier Character" 
              className="w-32 h-32 transform -rotate-45 object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyBadge;
