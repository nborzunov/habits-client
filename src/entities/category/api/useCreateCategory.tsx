import api from '@/shared/lib/api';
import { createMutation } from 'react-query-kit';

import { CategoryType } from '../model/types';

export const useCreateCategory = createMutation({
    mutationFn: (data: {
        name: string;
        is_default: boolean;
        parentId?: string;
        category_type: CategoryType;
    }) => api.post('category', { json: data }),
});
