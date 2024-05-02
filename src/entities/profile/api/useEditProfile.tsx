import api from '@/shared/lib/api';
import { User } from '@app/types';
import { createMutation } from 'react-query-kit';

import { EditProfileFields } from '../model/types';

export type EditProFileData = Required<Pick<User, EditProfileFields>>;

export const useEditProfile = createMutation({
    mutationFn: (formData: EditProFileData) => api.put(`users/me`, { json: formData }).json<User>(),
});
