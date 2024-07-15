import { queryClient } from '@shared/lib';
import api from '@shared/lib/api';
import { createMutation } from 'react-query-kit';

import { CreateTargetData } from '../model/types';

export const useCreateTarget = createMutation({
    mutationFn: (data: CreateTargetData) => {
        return api.post('targets/', { json: data }).text();
    },
    onSuccess: async () => {
        await Promise.all([
            queryClient.invalidateQueries(['todays-habits']),
            queryClient.invalidateQueries(['grid-habits']),
            queryClient.invalidateQueries(['weekly-habits']),
        ]);
    },
});
