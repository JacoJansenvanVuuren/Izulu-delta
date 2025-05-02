
import React from 'react';

const CompanyBadge = () => {
  return (
    <div className="flex items-center">
      <div className="mr-4">
        <h2 className="text-3xl font-bold">IZULU</h2>
        <h3 className="text-2xl font-bold">DELTA</h3>
      </div>
      <div className="relative overflow-hidden border-2 border-[#00ffcc] p-6 cod-section">
        <div className="cod-text">Marine</div>
        <div className="cod-text">Army</div>
        <div className="cod-text">Soldier</div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap');
        
        .cod-section {
          position: relative;
          overflow: hidden;
          width: 150px;
          text-align: center;
          font-family: 'Orbitron', sans-serif;
          color: #00ffcc;
        }
        
        .cod-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 255, 204, 0.05),
            rgba(0, 255, 204, 0.05) 2px,
            transparent 2px,
            transparent 4px
          );
          animation: scan 5s linear infinite;
          pointer-events: none;
        }
        
        @keyframes scan {
          0% { background-position: 0 0; }
          100% { background-position: 0 100%; }
        }
        
        .cod-text {
          font-size: 18px;
          margin: 8px 0;
          opacity: 0;
          animation: fadeIn 1s forwards;
        }
        
        .cod-text:nth-child(1) { animation-delay: 0.5s; }
        .cod-text:nth-child(2) { animation-delay: 1.5s; }
        .cod-text:nth-child(3) { animation-delay: 2.5s; }
        
        @keyframes fadeIn {
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default CompanyBadge;
