import { Box, Button, Flex, Heading, HStack, Icon, IconButton, Tooltip } from '@chakra-ui/react';
import Icons from '~/common/helpers/Icons';
import Statistics from '~/Habits/components/HabitDetails/Statistics';
import { YearlyCalendar } from '~/Habits/components/TargetCalendar/YearlyCalendar';
import { useRecoilState } from 'recoil';
import TargetChart from '~/Habits/components/HabitDetails/TargetChart';
import { habitsState } from '~/common/store/atoms';
import { useMutation } from '@tanstack/react-query';
import api from '~/common/helpers/api';
import MonthlyCalendar from '~/Habits/components/TargetCalendar/MonthlyCalendar';
import GridLayout from 'react-grid-layout';
import { useState } from 'react';
import useWidgets, { WidgetIdentifiers } from '~/Habits/hooks/useWidgets';
import Widget from '~/Habits/components/Grid/Widget';
import getCorrectDate from '~/common/utils/getCorrectDate';
import { CreateTargetData, Habit, TargetType } from '~/Habits/types';
import { setTitle } from '~/common/hooks/useTitle';
import TargetActionContext from '~/Habits/components/TargetCalendar/TargetActionContext';
import { useParams } from 'react-router';

const HabitDetails = () => {
    const [habits, setHabits] = useRecoilState(habitsState);
    const { habitId: selectedHabitId } = useParams();
    const habit = habits.find((h) => h.id === selectedHabitId);
    const [isEditMode, setIsEditMode] = useState(false);
    const { save, reset, removeWidget, widgets, props } = useWidgets(isEditMode);

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

    if (!habit) return null;

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
                        <GridLayout {...props}>
                            <div key={WidgetIdentifiers.CURRENT_STREAK}>
                                <Widget
                                    showCross={isEditMode}
                                    remove={() => removeWidget(WidgetIdentifiers.CURRENT_STREAK)}
                                >
                                    <Statistics
                                        title='Current streak'
                                        value={habit.currentStreak}
                                        type='streak'
                                        startDate={habit.currentStreakStartDate}
                                    />
                                </Widget>
                            </div>

                            <Box key={WidgetIdentifiers.COMPLETED_CHART}>
                                <Widget
                                    showCross={isEditMode}
                                    remove={() => removeWidget(WidgetIdentifiers.COMPLETED_CHART)}
                                >
                                    <TargetChart
                                        completed={habit.completedTargets}
                                        failed={habit.failedTargets}
                                    />
                                </Widget>
                            </Box>

                            <div key={WidgetIdentifiers.COMPLETED_TARGETS}>
                                <Widget
                                    showCross={isEditMode}
                                    remove={() => removeWidget(WidgetIdentifiers.COMPLETED_TARGETS)}
                                >
                                    <Statistics
                                        icon={Icons.Complete}
                                        title='Complete'
                                        value={habit.completedTargets}
                                        type='increase'
                                        footerValue={habit.completedTargets}
                                    />
                                </Widget>
                            </div>

                            <div key={WidgetIdentifiers.FAILED_TARGETS}>
                                <Widget
                                    showCross={isEditMode}
                                    remove={() => removeWidget(WidgetIdentifiers.FAILED_TARGETS)}
                                >
                                    <Statistics
                                        icon={Icons.Cross}
                                        title='Failed'
                                        value={habit.failedTargets}
                                        type='decrease'
                                        footerValue={habit.failedTargets}
                                    />
                                </Widget>
                            </div>

                            <div key={WidgetIdentifiers.TOTAL_TARGETS}>
                                <Widget
                                    showCross={isEditMode}
                                    remove={() => removeWidget(WidgetIdentifiers.TOTAL_TARGETS)}
                                >
                                    <Statistics
                                        title='Total'
                                        value={habit.totalTargets}
                                        type='none'
                                    />
                                </Widget>
                            </div>

                            <div key={WidgetIdentifiers.SKIPPED_TARGETS}>
                                <Widget
                                    showCross={isEditMode}
                                    remove={() => removeWidget(WidgetIdentifiers.SKIPPED_TARGETS)}
                                >
                                    <Statistics
                                        icon={Icons.ArrowRight}
                                        title='Skipped'
                                        value={habit.completedTargets}
                                        type='none'
                                    />
                                </Widget>
                            </div>

                            <div key={WidgetIdentifiers.YEARLY_CALENDAR}>
                                <Widget
                                    showCross={isEditMode}
                                    remove={() => removeWidget(WidgetIdentifiers.YEARLY_CALENDAR)}
                                >
                                    <YearlyCalendar targets={habit.targets} />
                                </Widget>
                            </div>
                            <div key={WidgetIdentifiers.MONTHLY_CALENDAR}>
                                <Widget
                                    showCross={isEditMode}
                                    remove={() => removeWidget(WidgetIdentifiers.MONTHLY_CALENDAR)}
                                >
                                    <MonthlyCalendar targets={habit.targets} />
                                </Widget>
                            </div>
                        </GridLayout>
                    </TargetActionContext.Provider>
                </Box>
            </Box>
            {isEditMode && (
                <Box m={0} flex={'1'}>
                    <Flex alignItems={'center'} justifyContent={'space-between'} px={4} pt={2}>
                        <Heading as='h3' size='md'>
                            Widgets
                        </Heading>
                    </Flex>
                    <HStack spacing={2}>
                        {!widgets.length && <Heading>No widgets left</Heading>}
                        {widgets.map((widget) => (
                            <Box key={widget} p={4}>
                                {widget}
                            </Box>
                        ))}
                    </HStack>
                </Box>
            )}
        </Flex>
    );
};

export default HabitDetails;
