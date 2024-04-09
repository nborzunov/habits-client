import { Grid } from '@chakra-ui/react';
import { useAchievements } from '@entities/achievement';
import React from 'react';

import { AchievementCard } from './ui/AchievementCard';

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

export { AchievementCard } from './ui/AchievementCard';
