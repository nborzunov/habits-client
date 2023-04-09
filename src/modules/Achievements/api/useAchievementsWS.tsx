import { useToast } from '@chakra-ui/react';
import { useEffect } from 'react';
import { achievementsData } from '~/modules/Achievements/const';
import { AchievementKey } from '~/modules/Achievements/types';

import { AchievementCard } from '../components/AchievementCard';

export const useAchievementsWS = () => {
    const toast = useToast();
    useEffect(() => {
        const ws = new WebSocket('ws://127.0.0.1:8080/achievements/ws');

        ws.addEventListener('message', (event) => {
            const newAchievements: AchievementKey[] = JSON.parse(event.data);
            newAchievements.map((achievementKey) => {
                setTimeout(() => {
                    const achievement = achievementsData.find((a) => a.key === achievementKey);
                    if (!achievement) {
                        return;
                    }
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

        return () => {
            ws.close();
        };
    }, [toast]);
};
