'use client';

import { useState } from 'react';
import { Transaction, TransactionFormData, CategoryTotal, Budget, BudgetFormData, CategoryBudgetComparison } from './types';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { ExpensesChart } from './components/ExpensesChart';
import { CategoryChart } from './components/CategoryChart';
import { SummaryCards } from './components/SummaryCards';
import { BudgetForm } from './components/BudgetForm';
import { BudgetComparison } from './components/BudgetComparison';
import { SpendingInsights } from './components/SpendingInsights';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAddBudgetDialogOpen, setIsAddBudgetDialogOpen] = useState(false);

  const handleAddTransaction = (data: TransactionFormData) => {
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      date: new Date(data.date),
    };
    setTransactions([...transactions, newTransaction]);
    setIsAddDialogOpen(false);
  };

  const handleEditTransaction = (data: TransactionFormData) => {
    if (!editingTransaction) return;
    
    const updatedTransactions = transactions.map(t => 
      t.id === editingTransaction.id 
        ? { ...t, ...data, date: new Date(data.date) }
        : t
    );
    setTransactions(updatedTransactions);
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
    toast.success("Transaction deleted successfully");
  };

  const handleAddBudget = (data: BudgetFormData) => {
    const existingBudgetIndex = budgets.findIndex(b => b.category === data.category);
    if (existingBudgetIndex !== -1) {
      const updatedBudgets = [...budgets];
      updatedBudgets[existingBudgetIndex] = data;
      setBudgets(updatedBudgets);
    } else {
      setBudgets([...budgets, data]);
    }
    setIsAddBudgetDialogOpen(false);
  };

  const categoryTotals: CategoryTotal[] = transactions.reduce((acc: CategoryTotal[], transaction) => {
    const existingCategory = acc.find(cat => cat.category === transaction.category);
    if (existingCategory) {
      existingCategory.total += transaction.amount;
    } else {
      acc.push({ category: transaction.category, total: transaction.amount });
    }
    return acc;
  }, []);

  const budgetComparisons: CategoryBudgetComparison[] = budgets.map(budget => {
    const actual = categoryTotals.find(cat => cat.category === budget.category)?.total || 0;
    return {
      category: budget.category,
      budget: budget.amount,
      actual,
      percentage: (actual / budget.amount) * 100
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">Personal Finance Tracker</h1>
          <div className="flex gap-2">
            <Dialog open={isAddBudgetDialogOpen} onOpenChange={setIsAddBudgetDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  Set Budget
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Set Category Budget</DialogTitle>
                </DialogHeader>
                <BudgetForm onSubmit={handleAddBudget} />
              </DialogContent>
            </Dialog>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Transaction
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Transaction</DialogTitle>
                </DialogHeader>
                <TransactionForm onSubmit={handleAddTransaction} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <SummaryCards
          transactions={transactions}
          categoryTotals={categoryTotals}
        />

        <Tabs defaultValue="charts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
          </TabsList>
          <TabsContent value="charts" className="space-y-4">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Monthly Expenses</h2>
                <ExpensesChart transactions={transactions} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Expenses by Category</h2>
                <CategoryChart data={categoryTotals} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="budget" className="space-y-4">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Budget vs Actual</h2>
                <BudgetComparison data={budgetComparisons} />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Spending Insights</h2>
                <SpendingInsights data={budgetComparisons} />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Recent Transactions</h2>
          <TransactionList
            transactions={transactions}
            onEdit={setEditingTransaction}
            onDelete={handleDeleteTransaction}
          />
        </div>

        {editingTransaction && (
          <Dialog open={true} onOpenChange={() => setEditingTransaction(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Transaction</DialogTitle>
              </DialogHeader>
              <TransactionForm
                onSubmit={handleEditTransaction}
                initialData={{
                  amount: editingTransaction.amount,
                  date: format(editingTransaction.date, 'yyyy-MM-dd'),
                  description: editingTransaction.description,
                  category: editingTransaction.category,
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}