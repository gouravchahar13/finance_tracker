'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CategoryBudgetComparison } from '../types';

interface BudgetComparisonProps {
  data: CategoryBudgetComparison[];
}

export function BudgetComparison({ data }: BudgetComparisonProps) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']}
          />
          <Legend />
          <Bar name="Budget" dataKey="budget" fill="hsl(var(--chart-1))" />
          <Bar name="Actual" dataKey="actual" fill="hsl(var(--chart-2))" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}