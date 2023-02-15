import { Box, Center, Heading, List, Spinner, Stack } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import useMobile from '~/common/hooks/useMobile';
import { completedHabitsState, uncompletedHabitsState } from '~/common/store/atoms';
import { useHabitsList } from '~/modules/Habits/api/useHabitsList';
import { HabitItem, HabitsListHeader } from '~/modules/Habits/components/HabitsList';

export const HabitsList = () => {
    const uncompletedHabits = useRecoilValue(uncompletedHabitsState);
    const completedHabits = useRecoilValue(completedHabitsState);

    const { t } = useTranslation();
    const isMobile = useMobile();
    const { isLoading } = useHabitsList();

    const noHabits = uncompletedHabits.length === 0 && completedHabits.length === 0;

    return (
        <Box
            borderRightColor='gray.200'
            borderRightWidth='2px'
            h='100vh'
            width={isMobile ? '100%' : '420px'}
        >
            <HabitsListHeader />
            <Box width={'100%'}>
                {isLoading && (
                    <Center width={'100%'} height={'50%'}>
                        <Spinner size='xl' color={`purple.500`} />
                    </Center>
                )}
                {noHabits && !isLoading && (
                    <Heading p={2} py={4} size={'md'} textAlign={'center'}>
                        {t('habits:noHabits')}
                    </Heading>
                )}
                <Stack spacing={0}>
                    {uncompletedHabits.map((habit) => (
                        <HabitItem key={habit.id} habit={habit} />
                    ))}
                </Stack>
                {completedHabits.length > 0 && (
                    <Box mt={4}>
                        <Heading as='h3' size='md' mb={'12px'} py='8px' px={2}>
                            {t('habits:completedToday')}
                        </Heading>
                        <List styleType='none'>
                            {completedHabits.map((habit) => (
                                <HabitItem key={habit.id} habit={habit} />
                            ))}
                        </List>
                    </Box>
                )}
            </Box>
        </Box>
    );
};
