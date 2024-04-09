import api from '@/shared/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { Category } from '../../../pages/finance/model/types';

export const useCategories = () => {
    const { t } = useTranslation();

    return useQuery<{
        income: Category[];
        expense: Category[];
    }>({
        queryKey: ['categories'],
        queryFn: () =>
            api
                .get('finance/category')
                .json<{
                    income: Category[];
                    expense: Category[];
                }>()
                .then(({ income, expense }) => {
                    income.forEach((category) => {
                        category.name = category.default
                            ? t(`finance:defaultIncomeCategories.${category.name}`)
                            : category.name;
                    });

                    expense.forEach((category) => {
                        category.name = category.default
                            ? t(`finance:defaultExpenseCategories.${category.name}`)
                            : category.name;
                    });
                    return { income, expense };
                }),
        initialData: {
            income: [],
            expense: [],
        },
        refetchInterval: 1000 * 60 * 10,
        refetchIntervalInBackground: true,
    });
};
