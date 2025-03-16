'use client';

import { CategoryBudgetComparison } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';

interface SpendingInsightsProps {
  data: CategoryBudgetComparison[];
}

export function SpendingInsights({ data }: SpendingInsightsProps) {
  const overBudgetCategories = data.filter(item => item.percentage > 100)
    .sort((a, b) => b.percentage - a.percentage);
  
  const underBudgetCategories = data.filter(item => item.percentage < 90)
    .sort((a, b) => a.percentage - b.percentage);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Over Budget Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {overBudgetCategories.map(category => (
              <div key={category.category} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-destructive" />
                  <span>{category.category}</span>
                </div>
                <Badge variant="destructive">
                  {category.percentage.toFixed(0)}% of budget
                </Badge>
              </div>
            ))}
            {overBudgetCategories.length === 0 && (
              <div className="text-sm text-muted-foreground">
                All categories are within budget
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Under Budget Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {underBudgetCategories.map(category => (
              <div key={category.category} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-primary" />
                  <span>{category.category}</span>
                </div>
                <Badge variant="secondary">
                  {category.percentage.toFixed(0)}% of budget
                </Badge>
              </div>
            ))}
            {underBudgetCategories.length === 0 && (
              <div className="text-sm text-muted-foreground">
                No categories under budget
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}