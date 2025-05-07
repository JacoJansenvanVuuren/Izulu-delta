
export interface Client {
  id: string;
  name: string;
  location: string;
  created_at: string;
}

export interface ClientPolicy {
  id: string;
  client_id: string;
  month: number;
  year: number;
  policies_count: number;
  policy_premium: number;
  issue_date: string | null;
  deduction_date: string | null;
  created_at: string;
}

export interface PolicyProduct {
  id: string;
  policy_id: string;
  product: string;
}

export interface PolicyNumber {
  id: string;
  policy_id: string;
  policy_number: string;
}

export interface ScheduleDoc {
  id: string;
  policy_id: string;
  file_path: string;
  file_name: string;
  uploaded_at: string;
}

export interface PdfDoc {
  id: string;
  policy_id: string;
  file_path: string;
  file_name: string;
  uploaded_at: string;
}

export interface LoaDoc {
  id: string;
  policy_id: string;
  file_path: string;
  file_name: string;
  uploaded_at: string;
}

// For the UI components
export interface ClientData {
  id: string;
  name: string;
  location: string;
  policiesCount: number;
  products: string[];
  scheduleDocsUrl: string[];
  pdfDocsUrl: string[];
  policyNumbers: string[];
  issueDate: string;
  deductionDate: string;
  loaDocUrl?: string;
  policyPremium: string;
}
