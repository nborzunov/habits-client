import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Navigate,
    Route,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
} from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { activeUserState } from '~/common/store/atoms';
import { useActiveUser } from '~/modules/Auth/api/useActiveUser';
import { Dashboard } from '~/modules/Dashboard';
import { AuthPage, HabitsPage, ProfilePage } from '~/pages';
import { Layout } from '~/ui/Layout/components/Layout';

function App() {
    const activeUser = useRecoilValue(activeUserState);
    const { isLoading } = useActiveUser();
    const { i18n } = useTranslation();

    useEffect(() => {
        dayjs.locale(i18n.options.lng);
    }, [i18n.options.lng]);

    const router = createBrowserRouter(
        createRoutesFromElements([
            <>
                {!activeUser && !isLoading && <Route path='/*' element={<AuthPage />} />}

                {(!!activeUser || isLoading) && (
                    <Route path='/' element={<Layout loading={isLoading} />}>
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
