import {
    As,
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    Icon,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    Tooltip,
} from '@chakra-ui/react';
import { GridHabit, Target, useCreateTarget, useGridHabits } from '@entities/habit';
import { useDeleteTarget } from '@entities/habit/api/useDeleteTarget';
import { Icons$ } from '@shared/lib';
import dayjs from 'dayjs';
import { PropsWithChildren, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const GridHabitsChart = () => {
    const { t } = useTranslation();
    const { data: habits = [], refetch: refetchHabits } = useGridHabits();

    const [page, setPage] = useState(0);
    const [horizontalPage, setHorizontalPage] = useState(0);

    const maxHorizontalPage = Math.ceil(
        dayjs().diff(
            dayjs(
                habits
                    .map((habit) => habit.targets)
                    .flat()
                    .map((target) => dayjs(target.date).toDate().getTime())
                    .sort((a, b) => a - b)[0],
            ),
            'days',
        ) / 14,
    );

    const paginatedHabits = useMemo(() => habits.slice(page * 4, (page + 1) * 4), [habits, page]);

    const { mutate: createTarget } = useCreateTarget({
        onSuccess: () => {
            refetchHabits();
        },
    });

    const { mutate: deleteTarget } = useDeleteTarget({
        onSuccess: () => {
            refetchHabits();
        },
    });

    const onComplete = (habit: GridHabit, date: string, amount: number) => {
        createTarget({
            habit_id: habit.id,
            date: date,
            amount,
        });
    };

    const onUncomplete = (target_id: string) => {
        deleteTarget(target_id);
    };
    return (
        <Grid
            templateColumns={'80px repeat(14, 1fr) repeat(3, 1fr)'}
            templateRows={`64px repeat(${habits.length}, 1fr) 30px`}
        >
            <HabitsCorner habits={habits}>
                <Button
                    size='xs'
                    p={0}
                    h='20px'
                    cursor='pointer'
                    onClick={() => setPage(page - 1)}
                    minWidth='80px'
                    isDisabled={page === 0}
                >
                    <Icon size='xs' h='10px' as={Icons$.Up} />
                </Button>
            </HabitsCorner>
            {[...Array(14).keys()].map((i) => (
                <DaysHeader key={i} i={horizontalPage * 14 + i + 1} />
            ))}
            {[t('habits:currentStreak'), t('habits:longestStreak'), t('habits:totalCount')].map(
                (label) => (
                    <StreakHeader key={label} label={label} />
                ),
            )}

            {paginatedHabits.map((habit) => {
                const targetsMap = habit.targets.reduce<Record<string, Target>>((acc, target) => {
                    acc[target.date] = target;
                    return acc;
                }, {});

                return (
                    <>
                        <HabitRow habit={habit} />

                        {[...Array(14).keys()].map((i) => {
                            const date = dayjs().subtract(horizontalPage * 14 + 14 - i - 1, 'day');
                            const target = targetsMap[date.format('YYYY-MM-DD')];

                            const day_of_week = date.day();
                            const mandatoryDay =
                                habit.frequency_type === 'daily' &&
                                habit.frequency_amount.includes(day_of_week);

                            if (habit.amount > 1) {
                                return (
                                    <HabitActionWrapper
                                        key={habit.id}
                                        onComplete={() =>
                                            onComplete(
                                                habit,
                                                date.format('YYYY-MM-DD'),
                                                habit.amount,
                                            )
                                        }
                                        onUncomplete={() => onUncomplete(target.id)}
                                        habit={habit}
                                        target={target}
                                    >
                                        <HabitCell
                                            habit={habit}
                                            target={target}
                                            streak={target.current_streak}
                                            isMandatoryDay={mandatoryDay}
                                            as={MenuButton}
                                        />
                                    </HabitActionWrapper>
                                );
                            }
                            return (
                                <HabitCell
                                    key={habit.id}
                                    habit={habit}
                                    target={target}
                                    streak={target.current_streak}
                                    isMandatoryDay={mandatoryDay}
                                    as={Button}
                                    onClick={() => {
                                        if (target.amount > 0) {
                                            onUncomplete(target.id);
                                        } else {
                                            onComplete(
                                                habit,
                                                date.format('YYYY-MM-DD'),
                                                habit.amount,
                                            );
                                        }
                                    }}
                                />
                            );
                        })}

                        {(['current_streak', 'longest_streak', 'total_count'] as const).map(
                            (key) => (
                                <StreakCell key={key} value={habit[key]} />
                            ),
                        )}
                    </>
                );
            })}

            <GridItem as={Flex} justify='center' align='center'>
                <Button
                    size='xs'
                    p={0}
                    h='20px'
                    cursor='pointer'
                    onClick={() => setPage(page + 1)}
                    isDisabled={(page + 1) * 4 >= habits.length}
                    minWidth='80px'
                >
                    <Icon size='xs' h='10px' as={Icons$.Down} />
                </Button>
            </GridItem>

            <GridItem colStart={2} colEnd={16} as={Flex} justify='center' align='center' gap={1}>
                <Button
                    size='xs'
                    p={0}
                    h='20px'
                    cursor='pointer'
                    onClick={() => setHorizontalPage(horizontalPage + 1)}
                    isDisabled={horizontalPage === maxHorizontalPage - 1}
                >
                    <Icon size='xs' h='10px' as={Icons$.Left} />
                </Button>
                <Button
                    size='xs'
                    p={0}
                    h='20px'
                    cursor='pointer'
                    onClick={() => setHorizontalPage(horizontalPage - 1)}
                    isDisabled={horizontalPage === 0}
                >
                    <Icon size='xs' h='10px' as={Icons$.Right} />
                </Button>
            </GridItem>
        </Grid>
    );
};

const Cell = (props: PropsWithChildren<any>) => {
    return (
        <GridItem as={Flex} px={0} py={0.5} {...props}>
            {props.children}
        </GridItem>
    );
};

const HabitsCorner = ({ children, habits }: PropsWithChildren<{ habits: GridHabit[] }>) => {
    const { t } = useTranslation();
    return (
        <Cell as={Flex} direction='column' justify='flex-end' align='start'>
            <Text fontSize='sm' fontWeight='bold' alignSelf='flex-start' display='block'>
                {t('common:habits')} ({habits.length})
            </Text>
            {children}
        </Cell>
    );
};

const DaysHeader = ({ i }: { i: number }) => {
    const date = dayjs().subtract(14 - i, 'day');

    return (
        <Cell direction='column' align='center' justify='center' px={1} py={1}>
            <Text fontSize='xs' display='block'>
                {date.format('MMM')}
            </Text>
            <Text fontSize='sm' fontWeight='bold' display='block' color='gray.600'>
                {date.format('DD')}
            </Text>
            <Text fontSize='xs' textTransform='uppercase' fontWeight='semibold' color='gray.600'>
                {date.format('ddd')}
            </Text>
        </Cell>
    );
};

const StreakHeader = ({ label }: { label: string }) => {
    return (
        <Cell px={0.5}>
            <Text
                fontSize='xs'
                fontWeight='semibold'
                alignSelf='flex-end'
                align='center'
                textTransform={'lowercase'}
            >
                {label}
            </Text>
        </Cell>
    );
};

const HabitRow = ({ habit }: { habit: GridHabit }) => {
    return (
        <Cell>
            <Tooltip label={habit.name}>
                <Text
                    fontSize='xs'
                    fontWeight='semibold'
                    whiteSpace='nowrap'
                    textOverflow='ellipsis'
                    overflow='hidden'
                    color='gray.600'
                >
                    {habit.name}
                </Text>
            </Tooltip>
        </Cell>
    );
};

const HabitCell = ({
    habit,
    target,
    streak,
    isMandatoryDay,
    as,
    onClick,
}: {
    habit: GridHabit;
    target: Target;
    streak: number;
    isMandatoryDay: boolean;
    as?: As;
    onClick?: () => void;
}) => {
    const { t } = useTranslation();
    const colorIntensity = Math.min(streak * 100, 800);
    const showMandatoryDayMessage =
        isMandatoryDay && habit.frequency_type === 'daily' && habit.frequency_amount.length < 7;
    // TODO: support for weekly, monthly and interval habits
    return (
        <Cell
            as={as}
            cursor='pointer'
            bg={target.amount ? `${habit.color}.${colorIntensity}` : 'transparent'}
            transition='background-color 0.2s ease-in-out'
            display='flex'
            direction='column'
            align='center'
            justify='center'
            p={0}
            minWidth='0'
            minHeight='0'
            height='25px'
            width='100%'
            borderRadius='0'
            __css={{
                '&>span': {
                    'pointer-events': 'auto',
                },
            }}
            _hover={{
                bg: target.amount ? `${habit.color}.${colorIntensity + 100}` : 'gray.100',
            }}
            onClick={() => onClick?.()}
        >
            {showMandatoryDayMessage && (
                <Tooltip label={t('habits:mandatoryDayMessage')}>
                    <Box
                        bgGradient='linear(to-bl, red.500 10px, transparent 0)'
                        width='100%'
                        height='25px'
                    ></Box>
                </Tooltip>
            )}
        </Cell>
    );
};

export const HabitActionWrapper = ({
    children,
    target,
    habit,
    onComplete,
    onUncomplete,
}: PropsWithChildren<{
    habit: GridHabit;
    target: Target;
    onComplete: () => void;
    onUncomplete: () => void;
}>) => {
    const { t } = useTranslation();
    return (
        <Menu autoSelect={false} arrowPadding={0}>
            {children}
            <MenuList py={0}>
                <MenuItem isDisabled={target.amount !== 0} onClick={onComplete}>
                    {t('habits:complete')}
                </MenuItem>
                <MenuItem
                    isDisabled={target.amount === 0 || habit.amount === 1}
                    onClick={() => alert('TODO')}
                >
                    {t('habits:updateAmount')}
                </MenuItem>
                <MenuItem isDisabled={target.amount === 0} onClick={onUncomplete}>
                    {t('habits:uncomplete')}
                </MenuItem>
            </MenuList>
        </Menu>
    );
};

const StreakCell = ({ value }: { value: number }) => {
    return (
        <Cell as={Box}>
            <Text
                fontSize='sm'
                fontWeight='semibold'
                color='gray.600'
                align='center'
                textTransform='lowercase'
            >
                {value}
            </Text>
        </Cell>
    );
};
