import { useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';
import api from '~/common/helpers/api';
import { habitsState } from '~/common/store/atoms';
import { AchievementCard } from '~/modules/Achievements/components/AchievementCard';
import { achievementsData } from '~/modules/Achievements/const';
import { CreateTargetData, Habit } from '~/modules/Habits/types';

export const useCreateTarget = () => {
    const setHabits = useSetRecoilState(habitsState);
    const toast = useToast();

    return useMutation({
        mutationFn: (data: CreateTargetData) => {
            return api
                .post('targets/', { json: data })
                .json<{
                    habit: Habit;
                    achievements: string[];
                }>()
                .then(({ habit: newHabit, achievements: newAchievements }) => {
                    setHabits((prev) => prev.map((h) => (h.id !== newHabit.id ? h : newHabit)));

                    newAchievements.map((achievementKey) => {
                        setTimeout(() => {
                            const achievement = achievementsData.find(
                                (a) => a.key === achievementKey,
                            );
                            if (!achievement) return;
                            toast({
                                position: 'top-right',
                                render: () => (
                                    <AchievementCard
                                        achievement={{
                                            ...achievement,
                                            progress: [],
                                            completed: true,
                                        }}
                                        alertView
                                    />
                                ),
                                duration: 6000,
                                isClosable: true,
                            });
                        }, 250);
                    });
                });
        },
    });
};
