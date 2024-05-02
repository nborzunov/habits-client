import api from '@/shared/lib/api';
import { createQuery } from 'react-query-kit';

import { Transaction } from '../model/types';

export const useTransactions = createQuery({
    queryKey: ['transactions'],
    fetcher: () => api.get('transaction').json<Transaction[]>(),
    initialData: [],
    refetchInterval: 1000 * 60 * 10,
    refetchIntervalInBackground: true,
});
