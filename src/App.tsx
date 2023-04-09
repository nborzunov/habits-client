import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Route,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
} from 'react-router-dom';
import { Auth, Login, Signup } from '~/modules/Auth';
import { AchievementsPage, AuthPage, DashboardPage, HabitsPage, ProfilePage } from '~/pages';
import { Layout } from '~/ui/Layout/components/Layout';

function App() {
    const { i18n } = useTranslation();

    useEffect(() => {
        dayjs.locale(i18n.options.lng);
    }, [i18n.options.lng]);

    const router = createBrowserRouter(
        createRoutesFromElements([
            <>
                <Route
                    path='/auth'
                    element={
                        <AuthPage>
                            <Auth />
                        </AuthPage>
                    }
                />
                <Route
                    path='/login'
                    element={
                        <AuthPage>
                            <Login />
                        </AuthPage>
                    }
                />
                <Route
                    path='/signup'
                    element={
                        <AuthPage>
                            <Signup />
                        </AuthPage>
                    }
                />
                <Route path='/' element={<Layout />}>
                    <Route path='habits/*' element={<HabitsPage />} />
                    <Route path='achievements' element={<AchievementsPage />} />
                    <Route path='dashboard' element={<DashboardPage />} />
                    <Route path='me/*' element={<ProfilePage />} />
                </Route>
            </>,
        ]),
    );
    return <RouterProvider router={router} />;
}

export default App;
