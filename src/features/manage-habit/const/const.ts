import { FrequencyType, HabitData } from '@entities/habit';

export const createHabitInitialState: HabitData = {
    name: '',
    color: 'purple',
    icon: '',
    amount: 1,
    goal: 21,
    frequencyType: FrequencyType.Daily,
    frequencyAmount: [0, 1, 2, 3, 4, 5, 6],
};

export const frequencyAmountInitialState = {
    [FrequencyType.Daily]: [0, 1, 2, 3, 4, 5, 6],
    [FrequencyType.Weekly]: [1],
    [FrequencyType.Monthly]: [1],
    [FrequencyType.Interval]: [1],
};
