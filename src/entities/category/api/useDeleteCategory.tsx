import api from '@shared/lib/api';
import { createMutation } from 'react-query-kit';

export const useDeleteCategory = createMutation({
    mutationFn: (category_id: string) => api.delete(`category/${category_id}`).text(),
});
