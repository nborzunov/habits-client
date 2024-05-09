import { Box, Flex, Grid, GridItem, Text, useTheme } from '@chakra-ui/react';
import { Target, TargetType } from '@entities/habit/model/types';
import { useMobile, useRelativeSize } from '@shared/hooks';
import { getLoopCallback } from '@shared/lib';
import dayjs from 'dayjs';
import { memo, useCallback, useContext, useMemo } from 'react';

import { CURRENT_YEAR } from './MonthlyCalendar';
import { TargetAction, TargetActionContext } from './TargetAction';

const cellGaps = {
    sm: 2,
    md: 2,
    lg: 3,
    xl: 3,
    '2xl': 3,
};
const cellSizes = {
    sm: 10,
    md: 10,
    lg: 12,
    xl: 12,
    '2xl': 12,
};

export const YearlyCalendar = memo(() => {
    const { targets } = useContext(TargetActionContext);

    const targetsMap = useMemo(
        () =>
            targets.reduce((acc, target) => {
                acc[dayjs(target.date).format('DD/MM/YYYY')] = target;
                return acc;
            }, {} as { [key: string]: Target }),
        [targets],
    );

    const cellGap = useRelativeSize(cellGaps);
    const cellSize = useRelativeSize(cellSizes);
    const getLoop = useCallback(getLoopCallback, []);

    const isMobile = useMobile();

    return (
        <Box>
            <Flex p='2' flexDirection='column'>
                <Grid gridTemplateColumns={`repeat(${isMobile ? 4 : 6}, 1fr) `}>
                    {getLoop(6).map((i) => (
                        <GridItem key={i}>
                            <Month
                                monthId={i}
                                gap={cellGap}
                                size={cellSize}
                                targetsMap={targetsMap}
                            />
                        </GridItem>
                    ))}
                </Grid>
                <Grid gridTemplateColumns={`repeat(${isMobile ? 4 : 6}, 1fr) `} mt={4}>
                    {getLoop(6).map((i) => (
                        <GridItem key={i}>
                            <Month
                                monthId={6 + i}
                                gap={cellGap}
                                size={cellSize}
                                targetsMap={targetsMap}
                            />
                        </GridItem>
                    ))}
                </Grid>
            </Flex>
        </Box>
    );
});

YearlyCalendar.displayName = 'YearlyCalendar';

const Month = memo(
    ({
        monthId,
        gap,
        size,
        targetsMap,
    }: {
        monthId: number;
        gap: number;
        size: number;
        targetsMap: Record<string, Target>;
    }) => {
        const daysInMonth = useMemo(
            () => dayjs(`${CURRENT_YEAR}-${monthId + 1}-1`).daysInMonth(),
            [monthId],
        );
        const firstDay = useMemo(() => dayjs(`${CURRENT_YEAR}-${monthId + 1}-1`).day(), [monthId]);
        const columns = Math.ceil((firstDay + daysInMonth) / 7);

        const month = useMemo(
            () => dayjs(`${CURRENT_YEAR}-${monthId + 1}-1`).format('MMM'),
            [monthId],
        );
        const getLoop = useCallback(getLoopCallback, []);

        return (
            <Box p='1'>
                <Text pb='1' textAlign='center' fontWeight='bold'>
                    {month}
                </Text>
                <Grid templateColumns={`repeat(${columns}, ${size}px)`} gap={`${gap}px`}>
                    {getLoop(columns).map((columnId) => (
                        <GridItem key={monthId + columnId}>
                            <Grid templateRows={`repeat(7, ${size}px)`} gap={`${gap}px`}>
                                {getLoop(7).map((rowId) => (
                                    <Cell
                                        key={monthId + columnId + rowId}
                                        monthId={monthId}
                                        dayId={columnId * 7 + rowId - firstDay}
                                        daysInMonth={daysInMonth}
                                        size={size}
                                        targetsMap={targetsMap}
                                    />
                                ))}
                            </Grid>
                        </GridItem>
                    ))}
                </Grid>
            </Box>
        );
    },
);

Month.displayName = 'Month';

const Cell = memo(
    ({
        dayId,
        monthId,
        daysInMonth,
        size,
        targetsMap,
    }: {
        dayId: number;
        monthId: number;
        daysInMonth: number;
        size: number;
        targetsMap: Record<string, Target>;
    }) => {
        const { habit } = useContext(TargetActionContext);
        const day = useMemo(
            () => dayjs(`${CURRENT_YEAR}-${monthId + 1}-${dayId + 1}`).startOf('day'),
            [dayId, monthId],
        );
        const target = useMemo(() => targetsMap[day.format('DD/MM/YYYY')], [targetsMap, day]);
        const {
            colors: { green },
        } = useTheme();
        const sizePx = useMemo(() => `${size}px`, [size]);
        const bgColor = useMemo(
            () =>
                target && target.target_type === TargetType.Skip
                    ? 'gray.300'
                    : target
                    ? green[500]
                    : 'gray.300',
            [target, green],
        );

        if (dayId < 0 || dayId >= daysInMonth || !habit) {
            return <Box key={'empty' + monthId + dayId} width={sizePx} height={sizePx} />;
        }
        return (
            <Box key={monthId + dayId} cursor='pointer'>
                <TargetAction date={day} target={target}>
                    {target && target.target_type === TargetType.Skip ? (
                        <Box
                            width={sizePx}
                            height={sizePx}
                            bg={bgColor}
                            borderTop='10px solid transparent'
                            borderWidth={`${sizePx} 0 0 ${sizePx}`}
                            borderColor={`transparent transparent transparent ${green[500]}}`}
                        ></Box>
                    ) : (
                        <Box width={sizePx} height={sizePx} bg={bgColor}></Box>
                    )}
                </TargetAction>
            </Box>
        );
    },
);

Cell.displayName = 'Cell';
