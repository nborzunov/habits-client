import api from '@/shared/lib/api';
import { Currency } from '@entities/finance';
import { createMutation } from 'react-query-kit';

import { Account, AccountType } from '../model/types';

export const useCreateAccount = createMutation({
    mutationFn: (data: {
        name: string;
        currency: Currency;
        account_type: AccountType;
        amount: number;
    }) => api.post('account', { json: data }).json<Account[]>(),
});
