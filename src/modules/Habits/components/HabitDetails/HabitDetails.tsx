import {
    Box,
    Button,
    Drawer,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    HStack,
    Heading,
    Icon,
    IconButton,
    Tooltip,
    useDisclosure,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Icons from '~/common/helpers/Icons';
import api from '~/common/helpers/api';
import useMobile from '~/common/hooks/useMobile';
import { setTitle } from '~/common/hooks/useTitle';
import { habitsState } from '~/common/store/atoms';
import getCorrectDate from '~/common/utils/getCorrectDate';
import { Widget, WidgetsList } from '~/modules/Habits/components/Grid';
import { Statistics, TargetChart } from '~/modules/Habits/components/HabitDetails';
import {
    MonthlyCalendar,
    TargetActionContext,
    YearlyCalendar,
} from '~/modules/Habits/components/TargetCalendar';
import { WidgetIdentifiers, useWidgets } from '~/modules/Habits/helpers';
import { CreateTargetData, Habit, TargetType } from '~/modules/Habits/types';
import Back from '~/ui/Layout/components/Back';

const GridLayout = WidthProvider(Responsive);

export const HabitDetails = () => {
    const habits = useRecoilValue(habitsState);
    const { habitId: selectedHabitId } = useParams();
    const habit = habits.find((h) => h.id === selectedHabitId);

    if (!habit) {
        return null;
    }

    return <HabitDetailsInner habit={habit} />;
};

export const HabitDetailsInner = ({ habit }: { habit: Habit }) => {
    const setHabits = useSetRecoilState(habitsState);
    const [isEditMode, setIsEditMode] = useState(false);
    const { save, reset, removeWidget, addWidget, widgets, layout, props } = useWidgets(
        habit,
        isEditMode,
    );

    // TODO: вынести мутейшены в отдельный файл
    const createTarget = useMutation({
        mutationFn: (data: CreateTargetData) => {
            return api
                .post<Habit>('/targets/', data)
                .then((res) => res.data)
                .then((newHabit) =>
                    setHabits((prev) => prev.map((h) => (h.id !== newHabit.id ? h : newHabit))),
                );
        },
    });

    setTitle(`${habit.title} - Habits`);

    const handleSaveLayout = () => {
        save();
        setIsEditMode(false);
    };

    const onChangeTarget = (
        id: string | undefined,
        date: Date,
        targetType: TargetType,
        value?: number,
    ) => {
        createTarget.mutate({
            id: id,
            habitId: habit.id,
            date: getCorrectDate(date),
            targetType: targetType,
            value: value || habit.goal,
        });
    };

    const { isOpen, onOpen, onClose } = useDisclosure();
    const isMobile = useMobile();

    return (
        <Flex width={'100%'}>
            <Box m={0} width='100%' maxWidth={'1600px'}>
                <Flex alignItems={'center'} justifyContent={'space-between'} px={4} pt={2}>
                    <Flex alignItems={'center'}>
                        {isMobile && (
                            <Link to={'/habits'}>
                                <Back />
                            </Link>
                        )}
                        <Heading as='h3' size='md'>
                            {habit.title}
                        </Heading>
                    </Flex>
                    <HStack spacing={2}>
                        {isEditMode && (
                            <HStack spacing={2}>
                                <Tooltip label={'Save'}>
                                    <IconButton
                                        aria-label={'save widgets'}
                                        icon={<Icon as={Icons.Save} />}
                                        onClick={handleSaveLayout}
                                        colorScheme={'purple'}
                                    />
                                </Tooltip>

                                <Tooltip label={'Add Widget'}>
                                    <Button
                                        colorScheme={'purple'}
                                        variant={'outline'}
                                        onClick={onOpen}
                                    >
                                        Add {widgets.length ? `(${widgets.length})` : ''}
                                    </Button>
                                </Tooltip>
                                <Tooltip label={'Reset'}>
                                    <Button
                                        colorScheme={'purple'}
                                        variant={'outline'}
                                        onClick={reset}
                                    >
                                        Reset
                                    </Button>
                                </Tooltip>

                                <Tooltip label={'Close'}>
                                    <IconButton
                                        aria-label={'close'}
                                        icon={<Icon as={Icons.Cross} />}
                                        onClick={() => setIsEditMode(!isEditMode)}
                                        colorScheme={'purple'}
                                        variant={'outline'}
                                    />
                                </Tooltip>
                            </HStack>
                        )}

                        {!isEditMode && (
                            <Tooltip label={'Edit grid'}>
                                <IconButton
                                    aria-label={'edit grid'}
                                    icon={<Icon as={Icons.Grid} />}
                                    onClick={() => setIsEditMode(!isEditMode)}
                                    colorScheme={'purple'}
                                    variant={'outline'}
                                />
                            </Tooltip>
                        )}
                    </HStack>
                </Flex>
                <Box userSelect={isEditMode ? 'none' : 'auto'}>
                    <TargetActionContext.Provider
                        value={{
                            habit,
                            onChangeTarget,
                        }}
                    >
                        <GridLayout {...props}>
                            {layout.map((widget) => (
                                <Box
                                    key={widget.i}
                                    onDragStart={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                >
                                    {widget.i === WidgetIdentifiers.CURRENT_STREAK && (
                                        <Widget
                                            isEditMode={isEditMode}
                                            remove={() =>
                                                removeWidget(WidgetIdentifiers.CURRENT_STREAK)
                                            }
                                        >
                                            <Statistics
                                                title='Current streak'
                                                value={habit.currentStreak}
                                                type='streak'
                                                startDate={habit.currentStreakStartDate}
                                            />
                                        </Widget>
                                    )}
                                    {widget.i === WidgetIdentifiers.COMPLETED_CHART && (
                                        <Widget
                                            isEditMode={isEditMode}
                                            remove={() =>
                                                removeWidget(WidgetIdentifiers.COMPLETED_CHART)
                                            }
                                        >
                                            <TargetChart
                                                completed={habit.completedTargets}
                                                failed={habit.failedTargets}
                                            />
                                        </Widget>
                                    )}
                                    {widget.i === WidgetIdentifiers.COMPLETED_TARGETS && (
                                        <Widget
                                            isEditMode={isEditMode}
                                            remove={() =>
                                                removeWidget(WidgetIdentifiers.COMPLETED_TARGETS)
                                            }
                                        >
                                            <Statistics
                                                icon={Icons.Complete}
                                                title='Complete'
                                                value={habit.completedTargets}
                                                type='increase'
                                                footerValue={habit.completedTargets}
                                            />
                                        </Widget>
                                    )}
                                    {widget.i === WidgetIdentifiers.FAILED_TARGETS && (
                                        <Widget
                                            isEditMode={isEditMode}
                                            remove={() =>
                                                removeWidget(WidgetIdentifiers.FAILED_TARGETS)
                                            }
                                        >
                                            <Statistics
                                                icon={Icons.Cross}
                                                title='Failed'
                                                value={habit.failedTargets}
                                                type='decrease'
                                                footerValue={habit.failedTargets}
                                            />
                                        </Widget>
                                    )}
                                    {widget.i === WidgetIdentifiers.TOTAL_TARGETS && (
                                        <Widget
                                            isEditMode={isEditMode}
                                            remove={() =>
                                                removeWidget(WidgetIdentifiers.TOTAL_TARGETS)
                                            }
                                        >
                                            <Statistics
                                                title='Total'
                                                value={habit.totalTargets}
                                                type='none'
                                            />
                                        </Widget>
                                    )}
                                    {widget.i === WidgetIdentifiers.SKIPPED_TARGETS && (
                                        <Widget
                                            isEditMode={isEditMode}
                                            remove={() =>
                                                removeWidget(WidgetIdentifiers.SKIPPED_TARGETS)
                                            }
                                        >
                                            <Statistics
                                                icon={Icons.ArrowRight}
                                                title='Skipped'
                                                value={habit.completedTargets}
                                                type='none'
                                            />
                                        </Widget>
                                    )}
                                    {widget.i === WidgetIdentifiers.YEARLY_CALENDAR && (
                                        <Widget
                                            isEditMode={isEditMode}
                                            remove={() =>
                                                removeWidget(WidgetIdentifiers.YEARLY_CALENDAR)
                                            }
                                        >
                                            <YearlyCalendar targets={habit.targets} />
                                        </Widget>
                                    )}
                                    {widget.i === WidgetIdentifiers.MONTHLY_CALENDAR && (
                                        <Widget
                                            isEditMode={isEditMode}
                                            remove={() =>
                                                removeWidget(WidgetIdentifiers.MONTHLY_CALENDAR)
                                            }
                                        >
                                            <MonthlyCalendar targets={habit.targets} />
                                        </Widget>
                                    )}
                                </Box>
                            ))}
                        </GridLayout>
                    </TargetActionContext.Provider>
                </Box>
            </Box>
            <Drawer isOpen={isOpen} placement='right' onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent
                    width={{
                        sm: '20em',
                        md: '20em',
                        lg: '12em',
                        xl: '14em',
                        '2xl': '15.5em',
                    }}
                >
                    <DrawerCloseButton />
                    <DrawerHeader>
                        <Heading as='h3' size='md'>
                            Widgets
                        </Heading>
                    </DrawerHeader>
                    <Box p={4}>
                        <WidgetsList widgets={widgets} addWidget={addWidget} />
                    </Box>
                </DrawerContent>
            </Drawer>
        </Flex>
    );
};
