import { Center, Icon, IconButton } from '@chakra-ui/react';
import { Habit } from '@entities/habit';
import { HabitsWidget } from '@entities/habit/hooks/useWidgets';
import { Icons$ } from '@shared/lib';
import { lazy, memo } from 'react';
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
            <Center
                borderRadius='xl'
                borderColor={'gray.200'}
                borderWidth='2px'
                p='2'
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
                        value={statistics.current_streak_count}
                        type='streak'
                        startDate={statistics.current_streak_start_date}
                        footerValue={statistics.current_streak_count_this_week}
                    />
                )}
                {id === HabitsWidget.COMPLETED_CHART && (
                    <TargetChart
                        completed={statistics.completed_count}
                        failed={statistics.failed_count}
                    />
                )}
                {id === HabitsWidget.COMPLETED_TARGETS && (
                    <WidgetContent
                        icon={Icons$.Complete}
                        title={t('habits:completedTargets.short')}
                        value={statistics.completed_count}
                        type='increase'
                        footerValue={statistics.completed_count_this_week}
                    />
                )}
                {id === HabitsWidget.FAILED_TARGETS && (
                    <WidgetContent
                        icon={Icons$.Cross}
                        title={t('habits:failedTargets.short')}
                        value={statistics.failed_count}
                        type='decrease'
                        footerValue={statistics.failed_count_this_week}
                    />
                )}
                {id === HabitsWidget.TOTAL_TARGETS && (
                    <WidgetContent
                        title={t('habits:totalDays')}
                        value={statistics.total_count}
                        type='none'
                        footerValue={statistics.total_count_this_week}
                    />
                )}
                {id === HabitsWidget.TOTAL_VALUES && (
                    <WidgetContent
                        title={t(`habits:totalValues.${habit.goal_type}`)}
                        value={statistics.total_values_count}
                        type='none'
                        footerValue={statistics.total_values_count_this_week}
                        unit={habit.goal_type}
                    />
                )}
                {id === HabitsWidget.COMPLETED_VALUES && (
                    <WidgetContent
                        title={t(`habits:completed_values.${habit.goal_type}`)}
                        value={statistics.completed_values}
                        type='none'
                        footerValue={statistics.completed_values_this_week}
                        unit={habit.goal_type}
                    />
                )}
                {id === HabitsWidget.SKIPPED_TARGETS && (
                    <WidgetContent
                        icon={Icons$.ArrowRight}
                        title={t('habits:skippedTargets.short')}
                        value={statistics.skipped_count}
                        type='none'
                        footerValue={statistics.skipped_count_this_week}
                    />
                )}
                {id === HabitsWidget.YEARLY_CALENDAR && <YearlyCalendarLazy />}
                {id === HabitsWidget.MONTHLY_CALENDAR && <MonthlyCalendarLazy />}
            </Center>
        );
    },
);

Widget.displayName = 'Widget';
