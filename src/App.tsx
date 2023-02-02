import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import {
    Navigate,
    Route,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
} from 'react-router-dom';
import { useRecoilState } from 'recoil';
import api from '~/common/helpers/api';
import { activeUserState, tokenState } from '~/common/store/atoms';
import { Dashboard } from '~/modules/Dashboard';
import { User } from '~/modules/Profile/types';
import { AuthPage, HabitsPage, ProfilePage } from '~/pages';
import { Layout } from '~/ui/Layout/components/Layout';

function App() {
    const [token, setToken] = useRecoilState(tokenState);
    const [activeUser, setActiveUser] = useRecoilState(activeUserState);

    const [loading, setLoading] = useState(true);

    const { refetch } = useQuery<User | null>({
        queryKey: ['active_user'],
        queryFn: async () => {
            if (!token) {
                setActiveUser(null);
                setLoading(false);
                return Promise.resolve(null);
            }

            api.defaults.headers.common['Authorization'] = token as string;

            return await api
                .get<User>('/users/me')
                .then((res) => res.data)
                .then((user) => {
                    setActiveUser(user);
                    setLoading(false);
                    return user;
                })
                .catch(() => {
                    setToken(null);
                    setLoading(false);
                    return null;
                });
        },
        initialData: null,
    });

    const refetchUser = () => {
        refetch();
    };

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
