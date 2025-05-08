
import React, { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface MultiEntryFieldProps {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

const MultiEntryField = ({ values = [], onChange, placeholder }: MultiEntryFieldProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to collapse
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentInput.trim()) {
      e.preventDefault();
      addItem();
    }
  };

  const addItem = () => {
    if (currentInput.trim()) {
      onChange([...values, currentInput.trim()]);
      setCurrentInput('');
    }
  };

  const removeItem = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
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
      <div className="flex flex-wrap gap-2">
        {values.map((item, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1 bg-secondary/30">
            {item}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeItem(index);
              }}
              className="ml-1 text-muted-foreground hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        
        {isExpanded && (
          <div className="flex-1 min-w-[100px]">
            <Input
              ref={inputRef}
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={addItem}
              placeholder={placeholder || "Add new item..."}
              className="border-0 p-0 h-8 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        )}
        
        {!isExpanded && values.length === 0 && (
          <span className="text-muted-foreground text-sm">
            {placeholder || "Click to add items..."}
          </span>
        )}
      </div>
    </div>
  );
};

export default MultiEntryField;
