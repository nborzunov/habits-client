import { Grid } from '@chakra-ui/react';
import { useAchievements } from '@entities/achievement';
import React from 'react';

import { AchievementCard } from './ui/AchievementCard';
import { AchievementProgressDialog } from './ui/AchievementProgressDialog';

export const AchievementsGrid = () => {
    // TODO: compare to friend ...

    const { data: achievements } = useAchievements();

    return (
        <Grid my={4} gridTemplateColumns={'repeat(auto-fit, minmax(450px, 1fr))'} gap={4}>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <AchievementProgressDialog id='AchievementProgress' />
            {achievements.map((achievement) => (
                <AchievementCard key={achievement.key} achievement={achievement} />
            ))}
        </Grid>
    );
};

export { AchievementCard } from './ui/AchievementCard';
