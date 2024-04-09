import { atom } from 'recoil';

import { Habit } from '../model/types';

export const habitsState = atom<Habit[]>({
    key: 'habitsState',
    default: [],
});
