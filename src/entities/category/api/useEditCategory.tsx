import api from '@/shared/lib/api';
import { createMutation } from 'react-query-kit';

import { CategoryData } from '../model/types';

export const useEditCategory = createMutation({
    mutationFn: ({ category_id, data }: { category_id: string; data: CategoryData }) =>
        api.put(`category/${category_id}`, { json: data }).text(),
});
