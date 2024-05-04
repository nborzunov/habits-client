import api from '@/shared/lib/api';
import { createMutation } from 'react-query-kit';

import { AccountData } from '../model/types';

export const useEditAccount = createMutation({
    mutationFn: ({ account_id, data }: { account_id: string; data: AccountData }) =>
        api.put(`account/${account_id}`, { json: data }).text(),
});
