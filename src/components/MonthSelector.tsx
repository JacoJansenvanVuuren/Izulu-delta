
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const monthsShort = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
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

  const currentYear = new Date().getFullYear();

  return (
    <div className="glass-morphism rounded-lg p-2 inline-flex items-center justify-center">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={handlePreviousMonth} className="text-primary hover:text-primary/80 hover:bg-white/5">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center mx-2">
          <Calendar className="h-4 w-4 mr-2 text-white" /> {/* Changed from text-primary/70 to text-white */}
          <span className="font-medium">{months[selectedMonth]} {currentYear}</span>
        </div>

        <Button variant="ghost" size="icon" onClick={handleNextMonth} className="text-primary hover:text-primary/80 hover:bg-white/5">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="hidden md:flex items-center ml-4 border-l border-white/10 pl-4">
        <TooltipProvider>
          {monthsShort.map((month, index) => (
            <Tooltip key={month}>
              <TooltipTrigger asChild>
                <Button
                  variant={selectedMonth === index ? "default" : "ghost"}
                  size="sm"
                  className={`px-2 py-1 min-w-[40px] ${
                    selectedMonth === index 
                      ? "bg-primary/20 text-primary border border-primary/30" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                  onClick={() => setSelectedMonth(index)}
                >
                  {month}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{months[index]}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
};

export default MonthSelector;
