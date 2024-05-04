import api from '@/shared/lib/api';
import { createMutation } from 'react-query-kit';

import { CategoryData } from '../model/types';

export const useCreateCategory = createMutation({
    mutationFn: (data: CategoryData) => api.post('category', { json: data }),
});
