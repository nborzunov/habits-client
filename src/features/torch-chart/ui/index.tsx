import { Box, Flex, Grid, GridItem, Text, Tooltip } from '@chakra-ui/react';
import { useWeeklyHabits } from '@entities/habit';
import { WeeklyHabitsData } from '@entities/habit/model/types';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

const TorchChartDay = ({ day }: { day: WeeklyHabitsData[0] }) => {
    const { t } = useTranslation();
    const isToday = day.date === dayjs().format('YYYY-MM-DD');
    return (
        <Flex as={GridItem} direction='column' justify='flex-end' align='center' h='100%'>
            <Flex direction='column' justify='flex-end' gap={1.5} h='calc(100% - 24px)'>
                {day.habits.map((habit) => {
                    const totalHabits = day.habits.length;

                    const height = Math.floor(((100 / totalHabits) * habit.progress) / 100);
                    return (
                        <Tooltip
                            key={`${dayjs(day.date).day()}_${habit.name}`}
                            label={`${habit.name} - ${habit.progress}% (${habit.streak}/${habit.goal})`}
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
                {t(`common:weekDays.${dayjs(day.date).day()}`)}
            </Text>
        </Flex>
    );
};

export const TorchChart = () => {
    const { data: weeklyStats = [] } = useWeeklyHabits();

    return (
        <Flex width='100%' height='100%' p={2}>
            <Grid gridTemplateColumns='repeat(7, 1fr)' h='100%' width='100%' gap={4}>
                {weeklyStats.map((day) => (
                    <TorchChartDay key={day.date} day={day} />
                ))}
            </Grid>
        </Flex>
    );
};
