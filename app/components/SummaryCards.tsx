'use client';

import { Transaction, CategoryTotal } from "../types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SummaryCardsProps {
  transactions: Transaction[];
  categoryTotals: CategoryTotal[];
}

export function SummaryCards({ transactions, categoryTotals }: SummaryCardsProps) {
  const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
  const topCategory = categoryTotals.reduce((prev, current) => 
    current.total > prev.total ? current : prev
  , categoryTotals[0]);

  const recentTransactions = [...transactions]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 3);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Category</CardTitle>
        </CardHeader>
        <CardContent>
          {topCategory ? (
            <>
              <div className="text-2xl font-bold">{topCategory.category}</div>
              <p className="text-xs text-muted-foreground">
                ${topCategory.total.toFixed(2)}
              </p>
            </>
          ) : (
            <div className="text-muted-foreground">No data available</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentTransactions.map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="truncate">{transaction.description}</span>
                  <Badge variant="secondary" className="text-xs">
                    {transaction.category}
                  </Badge>
                </div>
                <span className="font-medium">${transaction.amount.toFixed(2)}</span>
              </div>
            ))}
            {recentTransactions.length === 0 && (
              <div className="text-muted-foreground">No recent transactions</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}