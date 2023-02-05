import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Navigate,
    Route,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
} from 'react-router-dom';
import { useRecoilState } from 'recoil';
import api from '~/common/helpers/api';
import { activeUserState } from '~/common/store/atoms';
import { Dashboard } from '~/modules/Dashboard';
import { User } from '~/modules/Profile/types';
import { AuthPage, HabitsPage, ProfilePage } from '~/pages';
import { Layout } from '~/ui/Layout/components/Layout';

function App() {
    const [activeUser, setActiveUser] = useRecoilState(activeUserState);

    const [loading, setLoading] = useState(true);

    const { refetch } = useQuery<User | null>({
        queryKey: ['active_user'],
        queryFn: async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setActiveUser(null);
                setLoading(false);
                return Promise.resolve(null);
            }

            return await api
                .get('users/me')
                .json<User>()
                .then((user) => {
                    setActiveUser(user);
                    setLoading(false);
                    return user;
                })
                .catch(() => {
                    localStorage.removeItem('authToken');
                    setLoading(false);
                    return null;
                });
        },
        initialData: null,
    });

    const refetchUser = () => {
        refetch();
    };

    const { i18n } = useTranslation();
    useEffect(() => {
        dayjs.locale(i18n.options.lng);
    }, [i18n.options.lng]);

    const router = createBrowserRouter(
        createRoutesFromElements([
            <>
                {!activeUser && !loading && (
                    <Route path='/*' element={<AuthPage refetchUser={refetchUser} />} />
                )}

                {(!!activeUser || loading) && (
                    <Route path='/' element={<Layout loading={loading} />}>
                        <Route path='habits/*' element={<HabitsPage />} />
                        <Route path='dashboard' element={<Dashboard />} />
                        <Route path='me/*' element={<ProfilePage />} />
                        <Route path='*' element={<Navigate to='/habits' replace />} />
                    </Route>
                )}
            </>,
        ]),
    );
    return <RouterProvider router={router} />;
}

export default App;
