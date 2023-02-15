import { useQuery } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';
import api from '~/common/helpers/api';
import { activeUserState } from '~/common/store/atoms';
import { User } from '~/modules/Profile/types';

export const useActiveUser = () => {
    const setActiveUser = useSetRecoilState(activeUserState);

    return useQuery<User | null>({
        queryKey: ['active_user'],
        queryFn: async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setActiveUser(null);
                return Promise.resolve(null);
            }

            return await api
                .get('users/me')
                .json<User>()
                .then((user) => {
                    setActiveUser(user);
                    return user;
                })
                .catch(() => {
                    localStorage.removeItem('authToken');
                    return null;
                });
        },
        initialData: null,
    });
};
