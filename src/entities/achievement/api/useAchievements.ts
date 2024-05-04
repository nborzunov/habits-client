import api from '@/shared/lib/api';
import { createQuery } from 'react-query-kit';

import { achievementsData } from '../model/const';
import { Achievement, BaseAchievement } from '../model/types';

export const useAchievements = createQuery({
    queryKey: ['achievements'],
    fetcher: async () =>
        api
            .get('achievements/')
            .json<BaseAchievement[]>()
            .then((achievements) =>
                achievements.map((achievement) => {
                    const achievementData = achievementsData.find((a) => a.key === achievement.key);
                    return {
                        ...achievementData,
                        ...achievement,
                    } as Achievement;
                }),
            ),
    initialData: [],
});
