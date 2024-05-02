import api from '@/shared/lib/api';
import { t } from 'i18next';
import { createQuery } from 'react-query-kit';

import { Category } from '../model/types';

const parseCategories = (categories: Category[], defaultNameKey: string) => {
    return categories.map((category: Category) => {
        if (category.is_default) {
            category.name = t(`finance:${defaultNameKey}.${category.name}`);
        }
        return category;
    });
};
export const useCategories = createQuery({
    queryKey: ['categories'],
    fetcher: () =>
        api
            .get('category')
            .json<{
                income: Category[];
                expense: Category[];
            }>()
            .then(({ income, expense }) => ({
                income: parseCategories(income, 'defaultCategories.income'),
                expense: parseCategories(expense, 'defaultCategories.expense'),
            })),
    initialData: {
        income: [],
        expense: [],
    },
    refetchInterval: 1000 * 60 * 10,
    refetchIntervalInBackground: true,
});
