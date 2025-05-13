import { ReactNode } from 'react';

export interface MultiDateFieldProps {
  label: string;
  fieldName: string;
  value?: Date[];
  onChange: (dates: Date[]) => void;
}

declare const MultiDateField: React.FC<MultiDateFieldProps>;

export default MultiDateField;
