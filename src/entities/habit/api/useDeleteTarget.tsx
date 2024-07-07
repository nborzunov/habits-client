import api from '@shared/lib/api';
import { createMutation } from 'react-query-kit';

export const useDeleteTarget = createMutation({
    mutationFn: (target_id: string) => api.delete(`targets/${target_id}`).text(),
});
