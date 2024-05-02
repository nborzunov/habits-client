import api from '@/shared/lib/api';
import { createMutation } from 'react-query-kit';

import { Category } from '../model/types';

export const useReorderCategories = createMutation({
    mutationFn: (data: Array<{ id: string; c_order: number }>) =>
        api.post('category/reorder', { json: data }).json<Category[]>(),
});
