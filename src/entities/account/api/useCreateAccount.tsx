import api from '@/shared/lib/api';
import { createMutation } from 'react-query-kit';

import { Account, AccountData } from '../model/types';

export const useCreateAccount = createMutation({
    mutationFn: (data: AccountData) => api.post('account', { json: data }).json<Account[]>(),
});
