import api from '@shared/lib/api';
import { createMutation } from 'react-query-kit';

export const useDeleteAccount = createMutation({
    mutationFn: (account_id: string) => api.delete(`account/${account_id}`).text(),
});
