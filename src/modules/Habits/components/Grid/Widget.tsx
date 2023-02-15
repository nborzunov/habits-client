import { Box, Icon, IconButton } from '@chakra-ui/react';
import React, { lazy, memo } from 'react';
import { useTranslation } from 'react-i18next';
import Icons from '~/common/helpers/Icons';
import { Statistics, TargetChart } from '~/modules/Habits/components/HabitDetails';
import { WidgetIdentifiers } from '~/modules/Habits/helpers';
import { TargetStatistics } from '~/modules/Habits/types';

const YearlyCalendarLazy = lazy(() =>
    import('~/modules/Habits/components/TargetCalendar').then((m) => ({
        default: m.YearlyCalendar,
    })),
);

const MonthlyCalendarLazy = lazy(() =>
    import('~/modules/Habits/components/TargetCalendar').then((m) => ({
        default: m.MonthlyCalendar,
    })),
);

export const Widget = memo(
    ({
        isEditMode,
        remove,
        id,
        statistics,
    }: {
        isEditMode: boolean;
        remove: (id: WidgetIdentifiers) => void;
        id: WidgetIdentifiers;
        statistics: TargetStatistics;
    }) => {
        const { t } = useTranslation();

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
                        icon={<Icon as={Icons.Cross} />}
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
                {id === WidgetIdentifiers.CURRENT_STREAK && (
                    <Statistics
                        title={t('habits:currentStreak.lower')}
                        value={statistics.currentStreakCount}
                        type='streak'
                        startDate={statistics.currentStreakStartDate}
                        footerValue={statistics.currentStreakCountThisWeek}
                    />
                )}
                {id === WidgetIdentifiers.COMPLETED_CHART && (
                    <TargetChart
                        completed={statistics.completedCount}
                        failed={statistics.failedCount}
                    />
                )}
                {id === WidgetIdentifiers.COMPLETED_TARGETS && (
                    <Statistics
                        icon={Icons.Complete}
                        title={t('habits:completedTargets.short')}
                        value={statistics.completedCount}
                        type='increase'
                        footerValue={statistics.completedCountThisWeek}
                    />
                )}
                {id === WidgetIdentifiers.FAILED_TARGETS && (
                    <Statistics
                        icon={Icons.Cross}
                        title={t('habits:failedTargets.short')}
                        value={statistics.failedCount}
                        type='decrease'
                        footerValue={statistics.failedCountThisWeek}
                    />
                )}
                {id === WidgetIdentifiers.TOTAL_TARGETS && (
                    <Statistics
                        title={t('habits:totalTargets.short')}
                        value={statistics.totalCount}
                        type='none'
                        footerValue={statistics.totalCountThisWeek}
                    />
                )}
                {id === WidgetIdentifiers.SKIPPED_TARGETS && (
                    <Statistics
                        icon={Icons.ArrowRight}
                        title={t('habits:skippedTargets.short')}
                        value={statistics.skippedCount}
                        type='none'
                        footerValue={statistics.skippedCountThisWeek}
                    />
                )}
                {id === WidgetIdentifiers.YEARLY_CALENDAR && <YearlyCalendarLazy />}
                {id === WidgetIdentifiers.MONTHLY_CALENDAR && <MonthlyCalendarLazy />}
            </Box>
        );
    },
);

Widget.displayName = 'Widget';
