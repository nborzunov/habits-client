import api from '@shared/lib/api';
import dayjs from 'dayjs';
import { createQuery } from 'react-query-kit';

import { GridHabit, Target } from '../model/types';

export const useGridHabits = createQuery({
    queryKey: ['grid-habits'],
    fetcher: () =>
        api
            .get('habits/grid')
            .json<GridHabit[]>()
            .then((habits) => {
                const lowestDate = dayjs(
                    habits
                        .map((habit) => habit.targets)
                        .flat()
                        .map((target) => dayjs(target.date).toDate().getTime())
                        .sort((a, b) => a - b)[0],
                );

                return habits.map((habit) => {
                    habit.targets.reverse();
                    const targets = [];
                    const targetsMap = habit.targets.reduce<Record<string, Target>>(
                        (acc, target) => {
                            acc[target.date] = target;
                            return acc;
                        },
                        {},
                    );

                    const daysToProcess =
                        Math.ceil(dayjs().diff(dayjs(lowestDate), 'days') / 14) * 14;
                    const startDate = dayjs().subtract(daysToProcess, 'days');

                    for (let i = 0; i <= daysToProcess; i++) {
                        const date = startDate.add(i, 'day').format('YYYY-MM-DD');

                        targets.push({
                            id: targetsMap[date]?.id,
                            date: date,
                            amount: targetsMap[date]?.amount || 0,
                            current_streak: targetsMap[date]?.current_streak || 0,
                        } as Target);
                    }

                    habit.targets = targets;

                    return habit;
                });
            }),
    initialData: [],
});
