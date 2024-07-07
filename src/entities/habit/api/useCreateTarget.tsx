import api from '@shared/lib/api';
import { createMutation } from 'react-query-kit';

import { CreateTargetData } from '../model/types';

export const useCreateTarget = createMutation({
    mutationFn: (data: CreateTargetData) => {
        return api.post('targets/', { json: data }).text();
    },
});
