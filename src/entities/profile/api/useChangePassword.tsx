import api from '@/shared/lib/api';
import { createMutation } from 'react-query-kit';

export interface FormData {
    currentPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
}

export type ChangePasswordFields = keyof FormData;

export const useChangePassword = createMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
        api.post('users/me/change-password', { json: data }).json(),
});
