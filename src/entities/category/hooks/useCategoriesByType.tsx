import { transformCategories } from '@entities/finance';
import { useMemo } from 'react';

import { useCategories } from '../api/useCategories';
import { CategoryType } from '../model/types';

export const useCategoriesByType = (category_type: CategoryType) => {
    const {
        data: { income: incomeCategories, expense: expenseCategories },
    } = useCategories();

    return useMemo(() => {
        if (category_type === CategoryType.Income) {
            return transformCategories(incomeCategories);
        } else if (category_type === CategoryType.Expense) {
            return transformCategories(expenseCategories);
        }
        return [];
    }, [category_type, incomeCategories, expenseCategories]);
};
