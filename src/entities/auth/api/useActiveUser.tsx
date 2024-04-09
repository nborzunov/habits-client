import api from '@/shared/lib/api';
import { User } from '@app/types';
import { activeUserState } from '@entities/auth';
import { useQuery } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

export const useActiveUser = () => {
    const setActiveUser = useSetRecoilState(activeUserState);

    return useQuery<User | null>({
        queryKey: ['active_user'],
        queryFn: async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setActiveUser(null);
                return Promise.reject(null);
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
