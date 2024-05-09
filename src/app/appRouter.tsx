import AchievementsPage from '@/pages/achievements';
import { DashboardPage } from '@/pages/dashboard';
import { FinancePage } from '@/pages/finance';
import { ProfilePage } from '@/pages/profile';
import { Auth, Login, Signup } from '@entities/auth';
import { HabitPage } from '@pages/habit';
import { HabitsPage } from '@pages/habits';
import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import { Layout } from './layouts/Layout';

export const appRouter = createBrowserRouter(
    createRoutesFromElements([
        <>
            <Route path='/auth' element={<Auth />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/' element={<Layout />}>
                <Route path='habits' element={<HabitsPage />} />
                <Route path='habits/:habit_id' element={<HabitPage />} />
                <Route path='achievements' element={<AchievementsPage />} />
                <Route path='finance/*' element={<FinancePage />} />
                <Route path='dashboard' element={<DashboardPage />} />
                <Route path='me/*' element={<ProfilePage />} />
            </Route>
        </>,
    ]),
);
