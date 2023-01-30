import {
    Box,
    Flex,
    Grid,
    GridItem,
    HStack,
    Icon,
    IconButton,
    Text,
    Tooltip,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import React, { useCallback, useMemo, useState } from 'react';
import Icons from '~/common/helpers/Icons';
import getLoopCallback from '~/common/utils/getLoop';
import { TargetActionWrapper } from '~/modules/Habits/components/TargetCalendar';
import { Target, TargetType } from '~/modules/Habits/types';

export const MonthlyCalendar = ({ size, targets }: { size?: 'sm' | 'md'; targets: Target[] }) => {
    const [monthId, setMonthId] = useState(dayjs().month());
    const [year, setYear] = useState(dayjs().year());
    const targetsMap = useMemo(
        () =>
            Object.fromEntries(
                targets.map((target) => [dayjs(target.date).format('DD/MM/YYYY'), target]),
            ),
        [targets],
    );
    size = size || 'md';
    const daysOfTheWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getLoop = useCallback(getLoopCallback, []);

    const daysInMonth = useMemo(
        () => dayjs(`${year}-${monthId + 1}-1`).daysInMonth(),
        [year, monthId],
    );
    const date = useMemo(() => dayjs(`${year}-${monthId + 1}-1`), [year, monthId]);
    const firstDay = useMemo(() => date.day(), [date]);
    const columns = useMemo(() => Math.ceil((firstDay + daysInMonth) / 7), [firstDay, daysInMonth]);

    const sizeBinary = useMemo(() => (size === 'sm' ? 0 : 1), [size]);
    const gaps = useMemo(() => [3, 12], []);
    const cellSizes = useMemo(() => [40, 40], []);
    const gap = useMemo(() => gaps[sizeBinary], [gaps, sizeBinary]);

    const cellSize = useMemo(() => cellSizes[sizeBinary], [cellSizes, sizeBinary]);

    const handleSetMonth = useCallback(
        (month: number) => {
            if (monthId === 12) {
                if (year <= 2023) {
                    setYear(year + 1);
                    setMonthId(0);
                }
            } else if (month === -1) {
                if (year > 2022) {
                    setYear(year - 1);
                    setMonthId(11);
                }
            } else {
                setMonthId(month);
            }
        },
        [monthId, year, setYear, setMonthId],
    );

    console.log(year);
    return (
        <Box p='2' textAlign={'center'} height={'404px'}>
            <Flex justifyContent={'space-between'} alignItems={'center'} width={'100%'} pb={'2'}>
                <HStack spacing={'1'}>
                    <Tooltip label={'Previous year'} placement={'top'}>
                        <IconButton
                            aria-label='left'
                            icon={<Icon as={Icons.LeftDouble} />}
                            onClick={() => setYear(year - 1)}
                            isDisabled={year <= 2022}
                        />
                    </Tooltip>
                    <Tooltip label={'Previous month'} placement={'top'}>
                        <IconButton
                            aria-label='left'
                            icon={<Icon as={Icons.Left} />}
                            onClick={() => handleSetMonth(monthId - 1)}
                            isDisabled={year <= 2022 && monthId === 0}
                        />
                    </Tooltip>
                </HStack>
                <Text px={'2'}>{date.format('MMMM YYYY')}</Text>
                <HStack spacing={'1'}>
                    <Tooltip label={'Next month'} placement={'top'}>
                        <IconButton
                            aria-label='right'
                            icon={<Icon as={Icons.Right} />}
                            onClick={() => handleSetMonth(monthId + 1)}
                            isDisabled={year > 2023 && monthId === 11}
                        />
                    </Tooltip>

                    <Tooltip label={'Next year'} placement={'top'}>
                        <IconButton
                            aria-label='right'
                            icon={<Icon as={Icons.RightDouble} />}
                            onClick={() => setYear(year + 1)}
                            isDisabled={year > 2023}
                        />
                    </Tooltip>
                </HStack>
            </Flex>
            <Grid templateColumns={`repeat(7, ${cellSize}px)`} gap={`${gap}px`}>
                {getLoop(7).map((rowId) => (
                    <GridItem key={'grid-column' + monthId + rowId}>
                        <Box>
                            <Box>
                                <Text py='2' textAlign='center' fontWeight='bold'>
                                    {daysOfTheWeek[rowId]}
                                </Text>
                            </Box>

                            <Grid templateRows={`repeat(${columns}, 1fr)`} gap={`${gap}px`}>
                                {getLoop(columns).map((columnId) => (
                                    <Cell
                                        year={year}
                                        key={'cell' + monthId + columnId + rowId}
                                        columnId={columnId}
                                        rowId={rowId}
                                        rawMonthId={monthId}
                                        rawDayId={columnId * 7 + rowId - firstDay}
                                        daysInMonth={daysInMonth}
                                        size={cellSize}
                                        targetsMap={targetsMap}
                                        setMonthId={setMonthId}
                                    />
                                ))}
                            </Grid>
                        </Box>
                    </GridItem>
                ))}
            </Grid>
        </Box>
    );
};

const Cell = ({
    rawDayId,
    rawMonthId,
    columnId,
    rowId,
    year,
    daysInMonth,
    size,
    targetsMap,
}: {
    rawDayId: number;
    rawMonthId: number;
    columnId: number;
    rowId: number;
    year: number;
    daysInMonth: number;
    size: number;
    targetsMap: Record<string, Target>;
    setMonthId: (month: number) => void;
}) => {
    const sizePx = useMemo(() => `${size}px`, [size]);

    const monthId: number = useMemo(() => {
        let month;
        if (rawDayId > daysInMonth - 1) {
            month = rawMonthId + 1;
        } else if (rawDayId < 0) {
            month = rawMonthId - 1;
        } else {
            month = rawMonthId;
        }

        if (month > 11) {
            month = 0;
        }
        if (month < 0) {
            month = 11;
        }
        return month;
    }, [rawDayId, rawMonthId, daysInMonth]);

    const firstDay = useMemo(() => dayjs(`${year}-${rawMonthId + 1}-1`).day(), [year, rawMonthId]);

    const prevDate = useMemo(() => {
        let y = year;
        let m = monthId;
        if (m < 0) {
            m = 11;
            y = year - 1;
        } else if (m > 11) {
            m = 0;
            y = year + 1;
        }

        return dayjs(`${y}-${m + 1}-1`);
    }, [monthId, year]);

    const dayId = useMemo(() => {
        const day = columnId * 7 + rowId - firstDay;
        if (day > daysInMonth - 1) {
            return day - daysInMonth;
        } else if (day >= 0) {
            return day;
        } else {
            return prevDate.daysInMonth() + day;
        }
    }, [columnId, rowId, firstDay, daysInMonth, prevDate]);
    const day = useMemo(
        () => dayjs(`${year}-${monthId + 1}-${dayId + 1}`).startOf('day'),
        [dayId, monthId, year],
    );
    const target = useMemo(() => targetsMap[day.format('DD/MM/YYYY')], [targetsMap, day]);

    return (
        <Box cursor='pointer'>
            <TargetActionWrapper date={day} target={target}>
                {target && target.targetType === TargetType.Skip ? (
                    <Box
                        p={2}
                        width={sizePx}
                        height={sizePx}
                        borderRadius='50%'
                        color={'black'}
                        bg={'green.100'}
                        _hover={{
                            bg: 'green.200',
                        }}
                        transition={'all 0.2s'}
                    >
                        {day.format('D')}
                    </Box>
                ) : (
                    <Box
                        p={2}
                        width={sizePx}
                        height={sizePx}
                        borderRadius='50%'
                        color={
                            target ? 'white' : monthId !== rawMonthId ? 'blackAlpha.600' : 'black'
                        }
                        bg={target ? 'green.500' : 'transparent'}
                        _hover={{
                            bg: target ? 'green.600' : 'gray.200',
                        }}
                        transition={'all 0.2s'}
                    >
                        {day.format('D')}
                    </Box>
                )}
            </TargetActionWrapper>
        </Box>
    );
};
