import { transformCategories } from '@entities/finance';
import { useMemo } from 'react';

import { useCategories } from '../api/useCategories';
import { CategoryType } from '../model/types';

export const useCategoriesByType = (categoryType: CategoryType) => {
    const {
        data: { income: incomeCategories, expense: expenseCategories },
    } = useCategories();

    return useMemo(() => {
        if (categoryType === CategoryType.Income) {
            return transformCategories(incomeCategories);
        } else if (categoryType === CategoryType.Expense) {
            return transformCategories(expenseCategories);
        }
        return [];
    }, [categoryType, incomeCategories, expenseCategories]);
};
