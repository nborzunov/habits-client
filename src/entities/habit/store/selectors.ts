import { selector } from 'recoil';

import { habitsState } from './atoms';

export const uncompletedHabitsState = selector({
    key: 'uncompletedHabitsState',
    get: ({ get }) => {
        const list = get(habitsState);

        return list.filter((habit) => !habit.statistics.completedToday);
    },
});

export const completedHabitsState = selector({
    key: 'completedHabitsState',
    get: ({ get }) => {
        const list = get(habitsState);

        return list.filter((habit) => habit.statistics.completedToday);
    },
});
