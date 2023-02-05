import { Box, Heading, List, Stack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import api from '~/common/helpers/api';
import useMobile from '~/common/hooks/useMobile';
import {
    activeUserState,
    completedHabitsState,
    habitsState,
    uncompletedHabitsState,
} from '~/common/store/atoms';
import { HabitItem, HabitsListHeader } from '~/modules/Habits/components/HabitsList';
import { Habit } from '~/modules/Habits/types';

export const HabitsList = () => {
    const activeUser = useRecoilValue(activeUserState);
    const setHabits = useSetRecoilState(habitsState);
    const uncompletedHabits = useRecoilValue(uncompletedHabitsState);
    const completedHabits = useRecoilValue(completedHabitsState);

    const { t } = useTranslation();

    const [isLoading, setIsLoading] = useState(true);

    useQuery<Habit[]>({
        queryKey: ['habits'],
        queryFn: () =>
            api
                .get('habits/')
                .json<Habit[]>()
                .then((data) => {
                    setHabits(data);
                    setIsLoading(false);
                    return data;
                }),
        initialData: [],
        enabled: !!activeUser,
    });

    const noHabits = uncompletedHabits.length === 0 && completedHabits.length === 0;

    const isMobile = useMobile();

    return (
        <Box
            borderRightColor='gray.200'
            borderRightWidth='2px'
            h='100vh'
            width={isMobile ? '100%' : '360px'}
        >
            <HabitsListHeader />
            <Box width={'100%'}>
                {/*{isLoading && (*/}
                {/*    <Center width={'100%'} height={'50%'}>*/}
                {/*        <Spinner size='xl' color={`purple.500`} />*/}
                {/*    </Center>*/}
                {/*)}*/}
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
