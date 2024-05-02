import api from '@/shared/lib/api';
import { createMutation } from 'react-query-kit';

import { Account } from '../model/types';

export const useReorderAccounts = createMutation({
    mutationFn: (data: Array<{ id: string; a_order: number }>) =>
        api.post('account/reorder', { json: data }).json<Account[]>(),
});
