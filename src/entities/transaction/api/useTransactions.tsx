import api from '@/shared/lib/api';
import { useQuery } from '@tanstack/react-query';

import { Transaction } from '../model/types';

export const useTransactions = () => {
    return useQuery<Transaction[]>({
        queryKey: ['transactions'],
        queryFn: () => api.get('transaction').json<Transaction[]>(),
        initialData: [],
        refetchInterval: 1000 * 60 * 10,
        refetchIntervalInBackground: true,
    });
};
