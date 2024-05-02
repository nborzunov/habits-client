import api from '@/shared/lib/api';
import { createMutation } from 'react-query-kit';

import { TransactionType } from '../model/types';

export const useCreateTransaction = createMutation({
    mutationFn: (data: {
        created_date: Date;
        account_id: string;
        category_id: string;
        transaction_type: TransactionType;
        amount: number;
        note: string;
    }) => api.post('transaction', { json: data }),
});
