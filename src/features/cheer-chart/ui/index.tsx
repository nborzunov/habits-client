import { CircularProgress, CircularProgressLabel, Flex, Heading, Text } from '@chakra-ui/react';
import { useTodaysHabits } from '@entities/habit';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const states = {
    0: {
        color: 'red',
        text: "Let's get started!",
    },
    1: {
        color: 'orange',
        text: 'Keep going, you can do it!',
    },
    2: {
        color: 'yellow',
        text: 'You are almost done!',
    },
    3: {
        color: 'green',
        text: 'Great job, you did it!',
    },
};

export const CheerChart = () => {
    const { t } = useTranslation();
    const { data: todaysHabits = [] } = useTodaysHabits();

    const habitsCompleted = useMemo(
        () => todaysHabits.filter((habit) => habit.today_completed).length,
        [todaysHabits],
    );
    const habitsTotal = useMemo(() => todaysHabits.length, [todaysHabits]);

    const currentState = useMemo(() => {
        if (habitsCompleted === 0) {
            return 0;
        }
        if (habitsCompleted < habitsTotal / 2) {
            return 1;
        }
        if (habitsCompleted > habitsTotal / 2 && habitsCompleted < habitsTotal) {
            return 2;
        }
        return 3;
    }, [habitsCompleted, habitsTotal]);

    const state = states[currentState];

    return (
        <Flex
            bg={`${state.color}.100`}
            h='100%'
            p={4}
            borderRadius={'2xl'}
            direction='row'
            justify='space-between'
            align='center'
            transition='background-color 0.2s ease-in-out'
        >
            <Flex direction='column' align='center' rowGap='2'>
                <Heading fontSize='md' fontWeight='semibold' mb='3' textAlign='center'>
                    {state.text}
                </Heading>
                <Heading fontSize='xl' fontWeight='bold'>
                    <Text color={`${state.color}.400`} as='span'>
                        {habitsCompleted}
                    </Text>
                    /{habitsTotal}
                </Heading>
                <Heading fontSize='md' fontWeight='semibold' color='gray.600'>
                    {t('habits:habits')}
                </Heading>
            </Flex>
            <CircularProgress
                value={Math.floor((habitsCompleted / habitsTotal) * 100)}
                color={`${state.color}.300`}
                trackColor={`${state.color}.200`}
                size='64px'
                transition='all 0.2s ease-in-out'
                capIsRound
            >
                <CircularProgressLabel fontWeight='semibold'>
                    {Math.floor((habitsCompleted / habitsTotal) * 100)}%
                </CircularProgressLabel>
            </CircularProgress>
        </Flex>
    );
};
