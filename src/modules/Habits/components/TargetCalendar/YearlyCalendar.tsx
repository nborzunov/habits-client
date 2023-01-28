import { Box, Flex, Grid, GridItem, Text, useTheme } from '@chakra-ui/react';
import dayjs from 'dayjs';
import React, { useCallback, useContext, useMemo } from 'react';
import getLoopCallback from '~/common/utils/getLoop';
import {
    TargetActionContext,
    TargetActionWrapper,
} from '~/modules/Habits/components/TargetCalendar';
import { Target, TargetType } from '~/modules/Habits/types';

export const YearlyCalendar = ({
    size = 'md',
    targets,
}: {
    size?: 'sm' | 'md';
    targets: Target[];
}) => {
    const targetsMap = useMemo(
        () =>
            targets.reduce((acc, target) => {
                acc[dayjs(target.date).format('DD/MM/YYYY')] = target;
                return acc;
            }, {} as { [key: string]: Target }),
        [targets],
    );
    const sizeIndex = useMemo(() => (size === 'sm' ? 0 : 1), [size]);
    const getLoop = useCallback(getLoopCallback, []);
    return (
        <Box>
            <Flex p='2'>
                {getLoop(12).map((i) => (
                    <Month key={i} monthId={i} size={sizeIndex} targetsMap={targetsMap} />
                ))}
            </Flex>
        </Box>
    );
};

const Month = ({
    monthId,
    size,
    targetsMap,
}: {
    monthId: number;
    size: number;
    targetsMap: Record<string, Target>;
}) => {
    const daysInMonth = useMemo(() => dayjs(`2023-${monthId + 1}-1`).daysInMonth(), [monthId]);
    const firstDay = useMemo(() => dayjs(`2023-${monthId + 1}-1`).day(), [monthId]);
    const columns = Math.ceil((firstDay + daysInMonth) / 7);

    const gaps = [3, 3];
    const cellSizes = [12, 12];
    const gap = gaps[size];
    const cellSize = cellSizes[size];

    const month = useMemo(() => dayjs(`2023-${monthId + 1}-1`).format('MMM'), [monthId]);
    const getLoop = useCallback(getLoopCallback, []);

    return (
        <Box p='1'>
            <Text pb='1' textAlign='center' fontWeight='bold'>
                {month}
            </Text>
            <Grid templateColumns={`repeat(${columns}, ${cellSize}px)`} gap={`${gap}px`}>
                {getLoop(columns).map((columnId) => (
                    <GridItem key={monthId + columnId}>
                        <Grid templateRows={`repeat(7, ${cellSize}px)`} gap={`${gap}px`}>
                            {getLoop(7).map((rowId) => (
                                <Cell
                                    key={monthId + columnId + rowId}
                                    monthId={monthId}
                                    dayId={columnId * 7 + rowId - firstDay}
                                    daysInMonth={daysInMonth}
                                    size={cellSize}
                                    targetsMap={targetsMap}
                                />
                            ))}
                        </Grid>
                    </GridItem>
                ))}
            </Grid>
        </Box>
    );
};

const Cell = ({
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
        () => dayjs(`2023-${monthId + 1}-${dayId + 1}`).startOf('day'),
        [dayId, monthId],
    );
    const target = useMemo(() => targetsMap[day.format('DD/MM/YYYY')], [targetsMap, day]);
    const {
        colors: { green },
    } = useTheme();
    const sizePx = useMemo(() => `${size}px`, [size]);
    const bgColor = useMemo(
        () =>
            target && target.targetType === TargetType.Skip
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
            <TargetActionWrapper date={day} target={target}>
                {target && target.targetType === TargetType.Skip ? (
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
            </TargetActionWrapper>
        </Box>
    );
};
