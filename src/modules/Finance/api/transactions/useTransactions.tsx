import { useQuery } from '@tanstack/react-query';
import api from '~/common/helpers/api';
import { Transaction } from '~/modules/Finance/types';

export const useTransactions = () => {
    return useQuery<Transaction[]>({
        queryKey: ['transactions'],
        queryFn: () => api.get('finance/transaction').json<Transaction[]>(),
        initialData: [],
        refetchInterval: 1000 * 60 * 10,
        refetchIntervalInBackground: true,
    });
};
