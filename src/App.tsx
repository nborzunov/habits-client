import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '~/common/helpers/api';
import { useRecoilState } from 'recoil';
import { activeUserState, tokenState } from '~/common/store/atoms';
import { User } from '~/Profile/types';
import { Heading, useMediaQuery } from '@chakra-ui/react';
import Auth from '~/Auth/components/Auth';
import Signup from '~/Auth/components/Signup';
import Layout from '~/Layout/components/Layout';
import AuthStartup from '~/Auth/components/AuthStartup';
import ProfilePage from '~/Profile/components/ProfilePage';
import Dashboard from '~/Dashboard/components/Dashboard';
import Login from '~/Auth/components/Login';
import HabitsPage from '~/Habits/components/HabitsPage';
import { useState } from 'react';

function App() {
    const [token, setToken] = useRecoilState(tokenState);
    const [activeUser, setActiveUser] = useRecoilState(activeUserState);

    const [screenSmallThanSm] = useMediaQuery('(max-width: 800px)');
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

            const user = await api
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

            return user;
        },
        initialData: null,
    });

    const handleRefetchUser = () => {
        refetch();
    };
    return (
        <BrowserRouter>
            <Routes>
                {screenSmallThanSm ? (
                    <Route
                        path='*'
                        element={<Heading> Currently mobile view is not supported</Heading>}
                    />
                ) : (
                    <>
                        {!activeUser && !loading && (
                            <Route path='/' element={<Auth />}>
                                <Route path='/' element={<AuthStartup />} />
                                <Route
                                    path='signup'
                                    element={<Signup refetch={handleRefetchUser} />}
                                />
                                <Route
                                    path='login'
                                    element={<Login refetch={handleRefetchUser} />}
                                />
                                <Route path='*' element={<Navigate to='/login' replace />} />
                            </Route>
                        )}

                        {(!!activeUser || loading) && (
                            <Route path='/' element={<Layout loading={loading} />}>
                                <Route index path='habits' element={<HabitsPage />} />
                                <Route path='dashboard' element={<Dashboard />} />
                                {/*TODO: user profile route*/}
                                <Route path='me/*' element={<ProfilePage user={activeUser} />} />
                                <Route path='*' element={<Navigate to='/habits' replace />} />
                            </Route>
                        )}
                    </>
                )}
            </Routes>
        </BrowserRouter>
    );
}

export default App;
