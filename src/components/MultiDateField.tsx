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
      .filter((date): date is Date => date !== null);
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
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <div 
        className="flex flex-wrap items-center gap-1.5 bg-[#1e1e1e] border border-gray-700 rounded-md p-1.5 min-h-[42px] w-full"
        style={{ outline: 'none', boxShadow: 'none' }}
      >
        {dates.map((date, index) => (
          <div 
            key={index} 
            className="flex items-center bg-[#2a2a2a] text-gray-300 rounded-md px-2 py-0.5 text-xs"
          >
            {date.toLocaleDateString()}
            <button 
              onClick={() => handleRemoveDate(date)}
              className="ml-1.5 text-gray-500 hover:text-gray-200"
            >
              <Cross2Icon className="w-3 h-3" />
            </button>
          </div>
        ))}
        
        <div className="relative ml-auto">
          <button 
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
            className="text-gray-500 hover:text-gray-300"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
          
          {isDatePickerOpen && (
            <div className="absolute right-0 top-full z-50 mt-2">
              <DatePicker
                selected={null}
                onChange={handleAddDate}
                inline
                calendarClassName="bg-[#121212] text-white"
                dayClassName={(date) => 
                  "hover:bg-[#333] " + 
                  (dates.some(d => d.toDateString() === date.toDateString()) 
                    ? "bg-[#3a86ff] text-white" 
                    : "")
                }
              />
            </div>
          )}
        </div>
      </div>
      <input 
        type="hidden" 
        name={fieldName} 
        value={JSON.stringify(dates.map(d => d.toISOString()))} 
      />
    </div>
  );
}
