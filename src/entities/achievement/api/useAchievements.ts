import api from '@/shared/lib/api';
import { useQuery } from '@tanstack/react-query';

import { achievementsData } from '../model/const';
import { Achievement, BaseAchievement } from '../model/types';

export const useAchievements = () => {
    return useQuery<Achievement[]>({
        queryKey: ['achievements'],
        queryFn: async () =>
            api
                .get('achievements/')
                .json<BaseAchievement[]>()
                .then((achievements) =>
                    achievements.map((achievement) => {
                        const achievementData = achievementsData.find(
                            (a) => a.key === achievement.key,
                        );
                        return {
                            ...achievementData,
                            ...achievement,
                        } as Achievement;
                    }),
                ),
        initialData: [],
    });
};
