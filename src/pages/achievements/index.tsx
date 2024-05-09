import { Box, Flex, Heading } from '@chakra-ui/react';
import { useAchievements } from '@entities/achievement';
import { AchievementsGrid } from '@widgets/achievement-grid';
import { useTranslation } from 'react-i18next';

export const AchievementsPage = () => {
    const { t } = useTranslation();

    const { data: achievements = [] } = useAchievements();
    return (
        <Box>
            <Flex p={4} flexDir={'column'}>
                <Flex justify={'space-between'}>
                    <Heading as='h3' size='md'>
                        {t('achievements:achievements')}
                    </Heading>
                    <Heading as='h3' size='md'>
                        {t('achievements:completed_count', {
                            count: achievements.filter((a) => a.completed).length,
                            total: achievements.length,
                        })}
                    </Heading>
                </Flex>
                <AchievementsGrid />
            </Flex>
        </Box>
    );
};

export default AchievementsPage;
