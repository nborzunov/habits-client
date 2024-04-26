import api from '@/shared/lib/api';
import { useQuery } from '@tanstack/react-query';

import { Account } from '../model/types';

export const useAccounts = () => {
    return useQuery<Account[]>({
        queryKey: ['accounts'],
        queryFn: () => api.get('account').json<Account[]>(),
        initialData: [],
        refetchInterval: 1000 * 60 * 10,
        refetchIntervalInBackground: true,
    });
};
