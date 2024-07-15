import { queryClient } from '@shared/lib';
import api from '@shared/lib/api';
import { createMutation } from 'react-query-kit';

export const useDeleteTarget = createMutation({
    mutationFn: (target_id: string) => api.delete(`targets/${target_id}`).text(),
    onSuccess: async () => {
        await Promise.all([
            queryClient.invalidateQueries(['todays-habits']),
            queryClient.invalidateQueries(['grid-habits']),
            queryClient.invalidateQueries(['weekly-habits']),
        ]);
    },
});
