import api from '@/shared/lib/api';
import { createQuery } from 'react-query-kit';

import { Account } from '../model/types';

export const useAccounts = createQuery({
    queryKey: ['accounts'],
    fetcher: () => api.get('account').json<Account[]>(),
    initialData: [],
    refetchInterval: 1000 * 60 * 10,
    refetchIntervalInBackground: true,
});
