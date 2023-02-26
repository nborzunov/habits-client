import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Habit } from '~/modules/Habits/types';

export const ProgressBar = ({ habit }: { habit: Habit }) => {
    const { t } = useTranslation();

    const count = (habit.statistics.completedCount / habit.totalGoal) * 100;
    return (
        <Box width={'100%'} my={4}>
            <Box width='100%' h='10px' bg={'purple.100'} borderRadius={'lg'}>
                <Box
                    width={`${count}%`}
                    minWidth='6px'
                    h='10px'
                    bg={'purple.500'}
                    borderRadius={'lg'}
                />
            </Box>
            <Flex justify={'space-between'} fontWeight={'semibold'}>
                <Text>
                    {t('common:days', {
                        count: habit.statistics.completedCount,
                    })}
                </Text>
                <Text>
                    {t('common:days', {
                        count: habit.totalGoal,
                    })}
                </Text>
            </Flex>
        </Box>
    );
};
