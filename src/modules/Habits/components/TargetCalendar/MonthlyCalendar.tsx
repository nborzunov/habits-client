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
import React, { memo, useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icons from '~/common/helpers/Icons';
import useRelativeSize from '~/common/hooks/useRelativeSize';
import getLoopCallback from '~/common/utils/getLoop';
import {
    TargetActionContext,
    TargetActionWrapper,
} from '~/modules/Habits/components/TargetCalendar';
import { Target, TargetType } from '~/modules/Habits/types';

const cellGaps = {
    sm: 6,
    md: 6,
    lg: 8,
    xl: 8,
    '2xl': 9,
};
const cellSizes = {
    sm: 36,
    md: 36,
    lg: 36,
    xl: 36,
    '2xl': 36,
};

export const MonthlyCalendar = memo(() => {
    const { targets } = useContext(TargetActionContext);

    const [monthId, setMonthId] = useState(dayjs().month());
    const [year, setYear] = useState(dayjs().year());
    const targetsMap = useMemo(
        () =>
            Object.fromEntries(
                targets.map((target) => [dayjs(target.date).format('DD/MM/YYYY'), target]),
            ),
        [targets],
    );

    const getLoop = useCallback(getLoopCallback, []);

    const daysInMonth = useMemo(
        () => dayjs(`${year}-${monthId + 1}-1`).daysInMonth(),
        [year, monthId],
    );
    const date = useMemo(() => dayjs(`${year}-${monthId + 1}-1`), [year, monthId]);
    const firstDay = useMemo(() => date.day(), [date]);
    const columns = useMemo(() => Math.ceil((firstDay + daysInMonth) / 7), [firstDay, daysInMonth]);

    const cellGap = useRelativeSize(cellGaps);
    const cellSize = useRelativeSize(cellSizes);

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
    const { t } = useTranslation();
    const today = dayjs();

    return (
        <Box p='2' textAlign={'center'} height={`${cellSize * 7 + cellGap * 6 + 60}px`}>
            <Flex justifyContent={'space-between'} alignItems={'center'} width={'100%'} pb={'2'}>
                <HStack spacing={'1'}>
                    <Tooltip label={t('common:date.previousYear')} placement={'top'}>
                        <IconButton
                            aria-label='left'
                            icon={<Icon as={Icons.LeftDouble} />}
                            onClick={() => setYear(year - 1)}
                            isDisabled={year <= 2022}
                            size={{ base: 'md', sm: 'md' }}
                        />
                    </Tooltip>
                    <Tooltip label={t('common:date.previousMonth')} placement={'top'}>
                        <IconButton
                            aria-label='left'
                            icon={<Icon as={Icons.Left} />}
                            onClick={() => handleSetMonth(monthId - 1)}
                            isDisabled={year <= 2022 && monthId === 0}
                            size={{ base: 'md', sm: 'md' }}
                        />
                    </Tooltip>
                </HStack>
                <Text
                    px={{
                        base: 2,
                        sm: 1,
                    }}
                >
                    {date.format('MMMM YYYY')}
                </Text>
                <HStack spacing={'1'}>
                    <Tooltip label={t('common:date.nextMonth')} placement={'top'}>
                        <IconButton
                            aria-label='right'
                            icon={<Icon as={Icons.Right} />}
                            onClick={() => handleSetMonth(monthId + 1)}
                            isDisabled={
                                (year > 2023 && monthId === 11) ||
                                dayjs(`${year}-${monthId + 2}-1`) > today
                            }
                            size={{ base: 'md', sm: 'md' }}
                        />
                    </Tooltip>

                    <Tooltip label={t('common:date.nextYear')} placement={'top'}>
                        <IconButton
                            aria-label='right'
                            icon={<Icon as={Icons.RightDouble} />}
                            onClick={() => setYear(year + 1)}
                            isDisabled={
                                year > 2023 || dayjs(`${year + 1}-${monthId + 1}-1`) > today
                            }
                            size={{ base: 'md', sm: 'md' }}
                        />
                    </Tooltip>
                </HStack>
            </Flex>
            <Grid templateColumns={`repeat(7, ${cellSize}px)`} gap={`${cellGap}px`}>
                {getLoop(7).map((rowId) => (
                    <GridItem key={'grid-column' + monthId + rowId}>
                        <Box>
                            <Box>
                                <Text py='2' textAlign='center' fontWeight='bold'>
                                    {t(`common:weekDays.${rowId}`)}
                                </Text>
                            </Box>

                            <Grid templateRows={`repeat(${columns}, 1fr)`} gap={`${cellGap}px`}>
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
});

MonthlyCalendar.displayName = 'MonthlyCalendar';

const Cell = memo(
    ({
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

        const firstDay = useMemo(
            () => dayjs(`${year}-${rawMonthId + 1}-1`).day(),
            [year, rawMonthId],
        );

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
        const date = dayjs(`${year}-${monthId + 1}-${dayId + 1}`);
        const day = date.startOf('day');
        const target = targetsMap[day.format('DD/MM/YYYY')];

        const today = dayjs();

        const styles = {
            width: sizePx,
            height: sizePx,
            lineHeight: sizePx,
            borderRadius: '50%',
            bg:
                target && target.targetType === TargetType.Skip
                    ? 'green.100'
                    : target
                    ? 'green.500'
                    : 'transparent',
            color:
                target && target.targetType === TargetType.Skip
                    ? 'black'
                    : target
                    ? 'white'
                    : monthId !== rawMonthId || day > today
                    ? 'blackAlpha.600'
                    : 'black',

            transition: 'all 0.2s',
        };
        const hoverStyles = {
            bg:
                target && target.targetType === TargetType.Skip
                    ? 'green.200'
                    : target
                    ? 'green.600'
                    : 'gray.200',
        };
        return (
            <Box cursor='pointer'>
                <TargetActionWrapper
                    date={day}
                    target={target}
                    styles={{
                        ...styles,
                        _hover: hoverStyles,
                    }}
                    disabled={date > today}
                >
                    <Box {...styles}>{day.format('D')}</Box>
                </TargetActionWrapper>
            </Box>
        );
    },
);

Cell.displayName = 'Cell';
