import { Layout } from 'react-grid-layout';
import { atom, selector } from 'recoil';
import { Habit } from '~/modules/Habits/types';
import { User } from '~/modules/Profile/types';

export const habitsState = atom<Habit[]>({
    key: 'habitsState',
    default: [],
});

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

const localStorageEffect =
    (key: string) =>
    ({ setSelf, onSet }: { setSelf: any; onSet: any }) => {
        const savedValue = localStorage.getItem(key);
        if (savedValue != null) {
            setSelf(JSON.parse(savedValue));
        }

        onSet((newValue: string, _: any, isReset: boolean) => {
            isReset
                ? localStorage.removeItem(key)
                : localStorage.setItem(key, JSON.stringify(newValue));
        });
    };

export const activeUserState = atom<User | null>({
    key: 'activeUserState',
    default: null,
});

export const layoutState = atom<{
    [key: string]: {
        desktop: Layout[];
        mobile: Layout[];
    };
}>({
    key: 'layoutState',
    default: {},
    effects: [localStorageEffect('layout')],
});
