
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const months = [
  'Jan', 'Feb', 'March', 'April', 'May', 'June',
  'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

interface MonthSelectorProps {
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
}

const MonthSelector = ({ selectedMonth, setSelectedMonth }: MonthSelectorProps) => {
  const handlePreviousMonth = () => {
    setSelectedMonth(selectedMonth === 0 ? 11 : selectedMonth - 1);
  };

  const handleNextMonth = () => {
    setSelectedMonth(selectedMonth === 11 ? 0 : selectedMonth + 1);
  };

  return (
    <div className="flex items-center justify-start border-b border-white/10 pb-4 mb-6">
      <Button variant="ghost" size="sm" onClick={handlePreviousMonth}>
        <ChevronLeft className="h-4 w-4 mr-1" />
      </Button>
      
      <div className="flex items-center space-x-0.5">
        {months.map((month, index) => (
          <Button
            key={month}
            variant={selectedMonth === index ? "default" : "ghost"}
            size="sm"
            className={`px-2 py-1 ${
              selectedMonth === index 
                ? "bg-secondary text-secondary-foreground" 
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setSelectedMonth(index)}
          >
            {month}
          </Button>
        ))}
      </div>
      
      <Button variant="ghost" size="sm" onClick={handleNextMonth}>
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
};

export default MonthSelector;
