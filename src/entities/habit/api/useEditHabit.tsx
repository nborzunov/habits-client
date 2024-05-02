import api from '@shared/lib/api';
import { createMutation } from 'react-query-kit';

import { Habit, HabitData } from '../model/types';

export const useEditHabit = createMutation({
    mutationFn: ({ habit_id, data }: { habit_id: string; data: HabitData }) =>
        api.put(`habits/${habit_id}`, { json: data }).json<Habit>(),
});
