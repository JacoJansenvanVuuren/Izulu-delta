import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons';

// Custom CSS for DatePicker to override default styles
const customDatePickerStyles = `
  .react-datepicker {
    background-color: #121212 !important;
    color: white !important;
    border: 1px solid #333 !important;
  }
  .react-datepicker__header {
    background-color: #121212 !important;
    border-bottom: 1px solid #333 !important;
  }
  .react-datepicker__header * {
    color: white !important;
    font-weight: bold !important;
  }
  .react-datepicker__navigation {
    top: 10px !important;
  }
  .react-datepicker__navigation-icon::before {
    border-color: white !important;
    border-width: 2px 2px 0 0 !important;
  }
  .react-datepicker__day {
    color: white !important;
  }
  .react-datepicker__day:hover {
    background-color: #333 !important;
  }
  .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected {
    background-color: #3a86ff !important;
    color: white !important;
  }
  .react-datepicker__day--outside-month {
    color: #666 !important;
  }
`;

// Inject custom styles
const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = customDatePickerStyles;
document.head.appendChild(styleSheet);

/**
 * Props for the MultiDateField component
 */
interface MultiDateFieldProps {
  /** Label for the date field */
  label: string;
  /** Name of the input field */
  fieldName: string;
  /** Initial dates, can be a single date or an array of dates */
  value?: string | Date | (string | Date)[];
  /** Callback function when dates change */
  onChange: (dates: Date[]) => void;
  /** Additional CSS classes to apply to the container */
  className?: string;
}

/**
 * MultiDateField component for selecting and displaying multiple dates
 */
export default function MultiDateField({
  label, 
  fieldName, 
  value: initialDates = [], 
  onChange,
  className = ''
}: MultiDateFieldProps & { className?: string }) {
  /**
   * Convert various date input types to an array of Date objects
   * @param dates - Input dates to convert
   * @returns Array of valid Date objects
   */
  const convertToDates = (dates?: string | Date | (string | Date)[]): Date[] => {
    if (!dates) return [];
    
    // If dates is a single value, wrap it in an array
    const dateArray = Array.isArray(dates) ? dates : [dates];
    
    return dateArray
      .map(date => {
        // If already a Date object, return as-is
        if (date instanceof Date) return date;
        
        // If it's a string, parse it
        if (typeof date === 'string') {
          const parsedDate = new Date(date);
          return isNaN(parsedDate.getTime()) ? null : parsedDate;
        }
        
        return null;
      })
      .filter((date): date is Date => date !== null && !isNaN(date.getTime()));
  };

  const [dates, setDates] = useState<Date[]>(convertToDates(initialDates));
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  /**
   * Add a new date to the list
   * @param date - Date to add
   */
  const handleAddDate = (date: Date) => {
    const newDates = [...dates, date];
    setDates(newDates);
    onChange(newDates);
    setIsDatePickerOpen(false);
  };

  /**
   * Remove a date from the list
   * @param dateToRemove - Date to remove
   */
  const handleRemoveDate = (dateToRemove: Date) => {
    const newDates = dates.filter(date => 
      date.toDateString() !== dateToRemove.toDateString()
    );
    setDates(newDates);
    onChange(newDates);
  };

  return (
    <div 
      className={`relative ${className}`} 
      style={{ width: '180px', outline: 'none', boxShadow: 'none' }}
    >
      <div 
        className="flex flex-wrap items-center gap-1.5 rounded-md border border-input bg-background p-1.5 min-h-[42px] w-full relative focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-colors"
      >
        <label 
          className={`absolute text-xs text-gray-400 transition-all duration-200 ${dates.length > 0 ? 'opacity-0' : 'top-1/2 left-2 -translate-y-1/2'}`}
        >
          {label}
        </label>
        <div className="flex flex-wrap items-center gap-1.5 pr-8 w-full">
          {dates.map((date, index) => (
            <div 
              key={index} 
              className="flex items-center bg-secondary text-secondary-foreground rounded-md px-2 py-0.5 text-xs group"
            >
              {date.toLocaleDateString()}
              <button 
                onClick={() => handleRemoveDate(date)}
                className="ml-1.5 text-gray-500 hover:text-gray-200 z-10 group-hover:text-gray-200"
              >
                <Cross2Icon className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <button 
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            className="text-gray-500 hover:text-gray-300"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isDatePickerOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsDatePickerOpen(false);
            }
          }}
        >
          <div className="relative bg-background rounded-lg p-4 shadow-lg">
            <button 
              onClick={() => setIsDatePickerOpen(false)}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-300"
            >
              <Cross2Icon className="w-4 h-4" />
            </button>
            <DatePicker
              selected={null}
              onChange={handleAddDate}
              inline
              calendarClassName="bg-background text-foreground"
              dayClassName={(date) => {
                const isSelected = dates.some(d => d.toDateString() === date.toDateString());
                return `rounded-md hover:bg-gray-700/30 ${isSelected ? 'bg-[#4ade80]/20 text-[#4ade80]' : ''}`;
              }}
            />
          </div>
        </div>
      )}

      <input 
        type="hidden" 
        name={fieldName} 
        value={JSON.stringify(dates
          .filter(d => d instanceof Date && !isNaN(d.getTime()))
          .map(d => d.toISOString())
        )} 
      />
    </div>
  );
}
