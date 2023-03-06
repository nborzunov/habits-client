import { Grid } from '@chakra-ui/react';
import React from 'react';
import { useAchievements } from '~/modules/Achievements/api/useAchievements';
import { AchievementCard } from '~/modules/Achievements/components/AchievementCard';

export const AchievementsGrid = () => {
    // TODO: compare to friend ...

    const { data: achievements } = useAchievements();

    return (
        <Grid my={4} gridTemplateColumns={'repeat(auto-fit, minmax(450px, 1fr))'} gap={4}>
            {achievements.map((achievement) => (
                <AchievementCard key={achievement.key} achievement={achievement} />
            ))}
        </Grid>
    );
};
