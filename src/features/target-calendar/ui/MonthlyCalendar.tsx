import { Box, Flex, Grid, GridItem, Icon, IconButton, Text, Tooltip } from '@chakra-ui/react';
import { Target, TargetType } from '@entities/habit/model/types';
import { useRelativeSize } from '@shared/hooks';
import { Icons$, getLoopCallback } from '@shared/lib';
import dayjs from 'dayjs';
import React, { memo, useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { TargetAction, TargetActionContext } from './TargetAction';

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

export const CURRENT_YEAR = dayjs().year();
export const START_YEAR = 2023;

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
                if (year <= CURRENT_YEAR) {
                    setYear(year + 1);
                    setMonthId(0);
                }
            } else if (month === -1) {
                if (year > START_YEAR) {
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
                <Flex alignItems={'center'}>
                    <Tooltip label={t('common:date.previousMonth')} placement={'top'}>
                        <IconButton
                            aria-label='left'
                            icon={<Icon as={Icons$.Left} />}
                            onClick={() => handleSetMonth(monthId - 1)}
                            isDisabled={year <= 2022 && monthId === 0}
                            size={'sm'}
                        />
                    </Tooltip>

                    <Text
                        px={{
                            base: 2,
                            sm: 1,
                        }}
                        fontSize={'lg'}
                        fontWeight={'bold'}
                        ml={'2'}
                    >
                        {date.format('MMMM YYYY')}
                    </Text>
                </Flex>

                <Tooltip label={t('common:date.nextMonth')} placement={'top'}>
                    <IconButton
                        aria-label='right'
                        icon={<Icon as={Icons$.Right} />}
                        onClick={() => handleSetMonth(monthId + 1)}
                        isDisabled={
                            (year > CURRENT_YEAR && monthId === 11) ||
                            dayjs(`${year}-${monthId + 2}-1`) > today
                        }
                        size={'sm'}
                    />
                </Tooltip>
            </Flex>
            <Grid templateColumns={`repeat(7, ${cellSize}px)`} columnGap={`18px`} rowGap={'12px'}>
                {getLoop(7).map((rowId) => (
                    <GridItem key={'grid-column' + monthId + rowId}>
                        <Box>
                            <Box>
                                <Text py='2' textAlign='center' fontWeight='semibold' color='black'>
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
                target && target.target_type === TargetType.Skip
                    ? 'green.100'
                    : target
                    ? 'green.500'
                    : 'transparent',
            color:
                target && target.target_type === TargetType.Skip
                    ? 'gray.500'
                    : target
                    ? 'white'
                    : monthId !== rawMonthId || day > today
                    ? 'gray.400'
                    : 'black',

            transition: 'all 0.2s',
        };
        const hoverStyles = {
            bg:
                target && target.target_type === TargetType.Skip
                    ? 'green.200'
                    : target
                    ? 'green.600'
                    : 'gray.200',
        };
        return (
            <Box cursor={date > today ? 'default' : 'pointer'}>
                <TargetAction
                    date={day}
                    target={target}
                    styles={{
                        ...styles,
                        _hover: hoverStyles,
                    }}
                    disabled={date > today}
                >
                    <Box {...styles} fontWeight={'semibold'}>
                        {day.format('D')}
                    </Box>
                </TargetAction>
            </Box>
        );
    },
);

Cell.displayName = 'Cell';
