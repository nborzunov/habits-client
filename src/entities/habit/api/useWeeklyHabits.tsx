import api from '@shared/lib/api';
import dayjs from 'dayjs';
import { createQuery } from 'react-query-kit';

import { Habit, Target, TodaysHabit, WeeklyHabit, WeeklyHabitsData } from '../model/types';

export const useWeeklyHabits = createQuery<WeeklyHabitsData>({
    queryKey: ['weekly-habits'],
    fetcher: () =>
        Promise.all([
            api.get('habits/').json<Habit[]>(),
            api.get('habits/today').json<TodaysHabit[]>(),
        ]).then(([habits, todaysHabits]) => {
            const result: WeeklyHabitsData = [];

            const habitsMap = habits.reduce<Record<string, Habit>>((acc, habit) => {
                acc[habit.id] = habit;
                return acc;
            }, {});

            const habitsData = todaysHabits.map((habit) => {
                if (habitsMap[habit.id].targets.length === 0) {
                    return habit as any as Habit;
                }
                const targets = [];
                const targetsMap = habitsMap[habit.id].targets.reduce<Record<string, Target>>(
                    (acc, target) => {
                        acc[target.date] = target;
                        return acc;
                    },
                    {},
                );

                const daysToProcess = Math.ceil(
                    dayjs().diff(dayjs(habitsMap[habit.id].targets[0].date), 'days'),
                );
                const startDate = dayjs().subtract(daysToProcess, 'days');
                let progress = 0;

                for (let i = 0; i <= daysToProcess; i++) {
                    const date = startDate.add(i, 'day').format('YYYY-MM-DD');

                    if (targetsMap[date]) {
                        progress += 1;
                    }
                    targets.push({
                        id: targetsMap[date]?.id,
                        date: date,
                        progress,
                    });
                }

                // @ts-ignore
                habit.targets = targets as any as Target[];

                return habit as any as Habit;
            });
            for (let i = 0; i < 7; i++) {
                const date = dayjs().subtract(6 - i, 'day');

                result.push({
                    date: date.format('YYYY-MM-DD'),
                    habits: habitsData
                        .map(({ targets, ...habit }) => {
                            const today = targets.find(
                                (target) =>
                                    dayjs(target.date).startOf('day').toISOString() ===
                                    date.startOf('day').toISOString(),
                            );
                            return {
                                ...habit,
                                progress: Math.min(
                                    Math.floor(((today as any)?.progress / habit.goal) * 100),
                                    100,
                                ),
                                streak: (today as any)?.progress,
                            };
                        })
                        .filter((habit) => habit.progress > 0) as WeeklyHabit[],
                });
            }
            console.log(result);
            return result;
        }),
    initialData: [],
});
