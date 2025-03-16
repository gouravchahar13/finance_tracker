export type Category = 
  | "Food & Dining"
  | "Transportation"
  | "Shopping"
  | "Entertainment"
  | "Bills & Utilities"
  | "Health"
  | "Travel"
  | "Education"
  | "Other";

export interface Transaction {
  id: string;
  amount: number;
  date: Date;
  description: string;
  category: Category;
}

export interface TransactionFormData {
  amount: number;
  date: string;
  description: string;
  category: Category;
}

export interface CategoryTotal {
  category: Category;
  total: number;
}

export interface Budget {
  category: Category;
  amount: number;
}

export interface BudgetFormData {
  category: Category;
  amount: number;
}

export interface CategoryBudgetComparison {
  category: Category;
  budget: number;
  actual: number;
  percentage: number;
}