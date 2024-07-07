import api from '@shared/lib/api';
import { createQuery } from 'react-query-kit';

import { TodaysHabit } from '../model/types';

export const useTodaysHabits = createQuery({
    queryKey: ['todays-habits'],
    fetcher: () => api.get('habits/today').json<TodaysHabit[]>(),
    initialData: [],
});
