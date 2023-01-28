import { Box, Button, Flex, HStack, Heading, Icon, IconButton, Tooltip } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import GridLayout from 'react-grid-layout';
import { useParams } from 'react-router';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Icons from '~/common/helpers/Icons';
import api from '~/common/helpers/api';
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

    return (
        <Flex width={'100%'}>
            <Box m={0} width={'1600px'}>
                <Flex alignItems={'center'} justifyContent={'space-between'} px={4} pt={2}>
                    <Heading as='h3' size='md'>
                        {habit.title}
                    </Heading>
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
                        <GridLayout {...props} layout={layout}>
                            {layout.map((widget) => (
                                <Box key={widget.i}>
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
            {isEditMode && (
                <Box m={0} flex={'1'}>
                    <Flex
                        alignItems={'center'}
                        justifyContent={'space-between'}
                        pt={2}
                        height={'48px'}
                    >
                        <Heading as='h3' size='md'>
                            Widgets
                        </Heading>
                    </Flex>
                    <Box py={2} pr={2}>
                        <WidgetsList widgets={widgets} addWidget={addWidget} />
                    </Box>
                </Box>
            )}
        </Flex>
    );
};
