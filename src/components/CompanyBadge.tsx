
import React from 'react';

const CompanyBadge = () => {
  return (
    <div className="flex items-center">
      <div className="mr-4">
        <h2 className="text-3xl font-bold">IZULU</h2>
        <h3 className="text-2xl font-bold">DELTA</h3>
      </div>
      
      <div className="badge-container relative w-[150px] h-[150px]">
        <div className="circle absolute w-full h-full border-2 border-gray-500 rounded-full"></div>
        <div className="diamond absolute w-full h-full rotate-45 border-2 border-gray-500"></div>
        <div className="text absolute w-full h-full flex flex-col justify-center items-center font-['Permanent_Marker',_cursive] text-lg text-white">
          <div>Marine</div>
          <div>Army</div>
          <div>Soldier</div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap');
        
        .badge-container {
          width: 150px;
          height: 150px;
          position: relative;
        }
        
        .circle {
          width: 100%;
          height: 100%;
          border: 2px solid #888;
          border-radius: 50%;
          position: absolute;
          top: 0;
          left: 0;
          animation: pulse 3s infinite alternate;
        }
        
        .diamond {
          width: 70%;
          height: 70%;
          position: absolute;
          top: 15%;
          left: 15%;
          transform: rotate(45deg);
          border: 2px solid #888;
          box-sizing: border-box;
        }
        
        .text {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-family: 'Permanent Marker', cursive;
          font-size: 18px;
          color: #fff;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(136, 136, 136, 0.4);
          }
          100% {
            box-shadow: 0 0 0 10px rgba(136, 136, 136, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default CompanyBadge;
