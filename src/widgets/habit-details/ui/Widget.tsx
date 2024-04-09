import { Box, Icon, IconButton } from '@chakra-ui/react';
import { HabitsWidget } from '@entities/habit/hooks/useWidgets';
import { Habit } from '@entities/habit/model/types';
import { Icons$ } from '@shared/lib';
import React, { lazy, memo } from 'react';
import { useTranslation } from 'react-i18next';

import { TargetChart } from './TargetChart';
import { WidgetContent } from './WidgetContent';

const YearlyCalendarLazy = lazy(() =>
    import('@features/target-calendar/ui/YearlyCalendar').then((m) => ({
        default: m.YearlyCalendar,
    })),
);

const MonthlyCalendarLazy = lazy(() =>
    import('@features/target-calendar/ui/MonthlyCalendar').then((m) => ({
        default: m.MonthlyCalendar,
    })),
);

export const Widget = memo(
    ({
        isEditMode,
        remove,
        id,
        habit,
    }: {
        isEditMode: boolean;
        remove: (id: HabitsWidget) => void;
        id: HabitsWidget;
        habit: Habit;
    }) => {
        const { t } = useTranslation();
        const statistics = habit.statistics;

        return (
            <Box
                borderRadius='xl'
                borderColor={'gray.200'}
                borderWidth='2px'
                p='2'
                display='flex'
                justifyContent='center'
                alignItems={'center'}
                height={'100%'}
                position={'relative'}
                bg={'gray.50'}
            >
                {isEditMode && (
                    <IconButton
                        icon={<Icon as={Icons$.Cross} />}
                        aria-label={'remove widget'}
                        top={'0'}
                        position={'absolute'}
                        right={'0'}
                        size={'sm'}
                        variant={'ghost'}
                        onClick={() => remove(id)}
                        onDragStart={(e) => e.stopPropagation()}
                    />
                )}
                {id === HabitsWidget.CURRENT_STREAK && (
                    <WidgetContent
                        title={t('habits:currentStreak.lower')}
                        value={statistics.currentStreakCount}
                        type='streak'
                        startDate={statistics.currentStreakStartDate}
                        footerValue={statistics.currentStreakCountThisWeek}
                    />
                )}
                {id === HabitsWidget.COMPLETED_CHART && (
                    <TargetChart
                        completed={statistics.completedCount}
                        failed={statistics.failedCount}
                    />
                )}
                {id === HabitsWidget.COMPLETED_TARGETS && (
                    <WidgetContent
                        icon={Icons$.Complete}
                        title={t('habits:completedTargets.short')}
                        value={statistics.completedCount}
                        type='increase'
                        footerValue={statistics.completedCountThisWeek}
                    />
                )}
                {id === HabitsWidget.FAILED_TARGETS && (
                    <WidgetContent
                        icon={Icons$.Cross}
                        title={t('habits:failedTargets.short')}
                        value={statistics.failedCount}
                        type='decrease'
                        footerValue={statistics.failedCountThisWeek}
                    />
                )}
                {id === HabitsWidget.TOTAL_TARGETS && (
                    <WidgetContent
                        title={t('habits:totalDays')}
                        value={statistics.totalCount}
                        type='none'
                        footerValue={statistics.totalCountThisWeek}
                    />
                )}
                {id === HabitsWidget.TOTAL_VALUES && (
                    <WidgetContent
                        title={t(`habits:totalValues.${habit.goalType}`)}
                        value={statistics.totalValuesCount}
                        type='none'
                        footerValue={statistics.totalValuesCountThisWeek}
                        unit={habit.goalType}
                    />
                )}
                {id === HabitsWidget.COMPLETED_VALUES && (
                    <WidgetContent
                        title={t(`habits:completedValues.${habit.goalType}`)}
                        value={statistics.completedValues}
                        type='none'
                        footerValue={statistics.completedValuesThisWeek}
                        unit={habit.goalType}
                    />
                )}
                {id === HabitsWidget.SKIPPED_TARGETS && (
                    <WidgetContent
                        icon={Icons$.ArrowRight}
                        title={t('habits:skippedTargets.short')}
                        value={statistics.skippedCount}
                        type='none'
                        footerValue={statistics.skippedCountThisWeek}
                    />
                )}
                {id === HabitsWidget.YEARLY_CALENDAR && <YearlyCalendarLazy />}
                {id === HabitsWidget.MONTHLY_CALENDAR && <MonthlyCalendarLazy />}
            </Box>
        );
    },
);

Widget.displayName = 'Widget';
