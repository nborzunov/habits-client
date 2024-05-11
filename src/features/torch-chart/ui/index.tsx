import {
    Box,
    Flex,
    Grid,
    GridItem,
    Text,
    Tooltip,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

const TorchChartWeek = ({ week }: { week: any }) => {
    const { t } = useTranslation();
    const isToday = week.date.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD');
    return (
        <Flex as={GridItem} direction='column' justify='flex-end' align='center' h='100%'>
            <Flex direction='column' justify='flex-end' gap={1.5} h='calc(100% - 24px)'>
                {week.habits.map((habit: any) => {
                    const totalHabits = week.habits.length;

                    const height = Math.floor(((100 / totalHabits) * habit.progress) / 100);
                    return (
                        <Tooltip
                            key={`${week.date.day()}_${habit.title}`}
                            label={`${habit.title} - ${habit.progress}%`}
                            bg={`${habit.color}.400`}
                            hasArrow
                        >
                            <Box
                                cursor='pointer'
                                h={`${height}%`}
                                minHeight={'12px'}
                                w={2.5}
                                borderRadius='md'
                                bg={`${habit.color}.400`}
                                transition='all .2s ease-in-out'
                                _hover={{
                                    bg: `${habit.color}.500`,
                                }}
                            ></Box>
                        </Tooltip>
                    );
                })}
            </Flex>
            <Text mt={3} fontWeight='600' color={isToday ? 'gray.600' : 'gray.400'}>
                {t(`common:weekDays.${week.date.day()}`)}
            </Text>
        </Flex>
    );
};

export const TorchChart = () => {
    const weeklyStats = [
        {
            date: dayjs().subtract(6, 'day'),
            habits: [
                {
                    title: 'Sleep',
                    color: 'red',
                    icon: 'bed',
                    progress: 1,
                },
                {
                    title: 'Reading',
                    color: 'blue',
                    icon: 'book',
                    progress: 15,
                },
                {
                    title: 'Running',
                    color: 'green',
                    icon: 'footprints',
                    progress: 40,
                },
            ],
        },
        {
            date: dayjs().subtract(5, 'day'),
            habits: [
                {
                    title: 'Sleep',
                    color: 'red',
                    icon: 'bed',
                    progress: 3,
                },
                {
                    title: 'Reading',
                    color: 'blue',
                    icon: 'book',
                    progress: 20,
                },
                {
                    title: 'Running',
                    color: 'green',
                    icon: 'footprints',
                    progress: 45,
                },
            ],
        },
        {
            date: dayjs().subtract(4, 'day'),
            habits: [
                {
                    title: 'Sleep',
                    color: 'red',
                    icon: 'bed',
                    progress: 15,
                },
                {
                    title: 'Reading',
                    color: 'blue',
                    icon: 'book',
                    progress: 30,
                },
                {
                    title: 'Running',
                    color: 'green',
                    icon: 'footprints',
                    progress: 50,
                },
            ],
        },
        {
            date: dayjs().subtract(3, 'day'),
            habits: [
                {
                    title: 'Sleep',
                    color: 'red',
                    icon: 'bed',
                    progress: 25,
                },
                {
                    title: 'Reading',
                    color: 'blue',
                    icon: 'book',
                    progress: 30,
                },
                {
                    title: 'Running',
                    color: 'green',
                    icon: 'footprints',
                    progress: 55,
                },
            ],
        },
        {
            date: dayjs().subtract(2, 'day'),
            habits: [
                {
                    title: 'Sleep',
                    color: 'red',
                    icon: 'bed',
                    progress: 38,
                },
                {
                    title: 'Reading',
                    color: 'blue',
                    icon: 'book',
                    progress: 47,
                },
                {
                    title: 'Running',
                    color: 'green',
                    icon: 'footprints',
                    progress: 70,
                },
            ],
        },
        {
            date: dayjs().subtract(1, 'day'),
            habits: [
                {
                    title: 'Sleep',
                    color: 'red',
                    icon: 'bed',
                    progress: 45,
                },
                {
                    title: 'Reading',
                    color: 'blue',
                    icon: 'book',
                    progress: 47,
                },
                {
                    title: 'Running',
                    color: 'green',
                    icon: 'footprints',
                    progress: 85,
                },
            ],
        },
        {
            date: dayjs(),
            habits: [
                {
                    title: 'Sleep',
                    color: 'red',
                    icon: 'bed',
                    progress: 45,
                },
                {
                    title: 'Reading',
                    color: 'blue',
                    icon: 'book',
                    progress: 60,
                },
                {
                    title: 'Running',
                    color: 'green',
                    icon: 'footprints',
                    progress: 95,
                },
            ],
        },
    ];

    return (
        <Flex width='100%' height='100%' p={2}>
            <Grid gridTemplateColumns='repeat(7, 1fr)' h='100%' width='100%' gap={4}>
                {weeklyStats.map((week) => (
                    <TorchChartWeek key={week.date.format('YYYY-MM-DD')} week={week} />
                ))}
            </Grid>
        </Flex>
    );
};
