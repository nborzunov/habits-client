import api from '@shared/lib/api';
import { createMutation } from 'react-query-kit';

import { Habit, HabitData } from '../model/types';

export const useCreateHabit = createMutation({
    mutationFn: (data: HabitData) => api.post('habits/', { json: data }).json<Habit>(),
});
