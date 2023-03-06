import { useQuery } from '@tanstack/react-query';
import api from '~/common/helpers/api';
import { achievementsData } from '~/modules/Achievements/const';
import { Achievement, BaseAchievement } from '~/modules/Achievements/types';

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
