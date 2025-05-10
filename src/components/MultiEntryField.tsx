
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface MultiEntryFieldProps {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  onBlur?: () => void;
}

const MultiEntryField = ({ values = [], onChange, placeholder, onBlur }: MultiEntryFieldProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [localValues, setLocalValues] = useState<string[]>(values);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // Carefully sync with parent when values change externally
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      setLocalValues(values);
    }
  }, [values]);

  // Memoized click outside handler to prevent unnecessary re-renders
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setIsExpanded(false);
      
      // Only trigger onBlur if values have actually changed
      if (onBlur && JSON.stringify(localValues) !== JSON.stringify(values)) {
        onBlur();
      }
    }
  }, [onBlur, localValues, values]);

  // Handle clicking outside to collapse
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentInput.trim()) {
      e.preventDefault();
      addItem();
    }
  };

  const addItem = () => {
    if (currentInput.trim()) {
      const newValues = [...localValues, currentInput.trim()];
      setLocalValues(newValues);
      onChange(newValues);
      setCurrentInput('');
    }
  };

  const removeItem = (index: number) => {
    const newValues = localValues.filter((_, i) => i !== index);
    setLocalValues(newValues);
    onChange(newValues);
  };

  const handleExpandClick = () => {
    setIsExpanded(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  return (
    <div 
      ref={containerRef}
      className={`border rounded p-2 transition-all duration-200 bg-transparent border-white/10 min-h-[40px] ${
        isExpanded ? 'w-full min-w-[300px]' : 'w-full cursor-pointer hover:bg-white/5'
      }`}
      onClick={!isExpanded ? handleExpandClick : undefined}
    >
      <div className="flex flex-wrap gap-2 items-start">
        <div className="flex flex-wrap gap-1 inline-flex">
          {localValues.map((item, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="flex items-center gap-1 bg-secondary/30 mx-0.5 my-0.5 inline-flex"
              style={{ 
                maxWidth: 'calc(50% - 4px)', 
                marginRight: index % 2 === 0 ? '4px' : '0' 
              }}
            >
              <span className="truncate">{item}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeItem(index);
                }}
                className="ml-1 flex-shrink-0 text-muted-foreground hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        
        {isExpanded && (
          <div className="flex-1 min-w-[100px]">
            <Input
              ref={inputRef}
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder || "Add new item..."}
              className="border-0 p-0 h-8 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        )}
        
        {!isExpanded && localValues.length === 0 && (
          <span className="text-muted-foreground text-sm">
            {placeholder || "Click to add items..."}
          </span>
        )}
      </div>
    </div>
  );
};

export default MultiEntryField;
