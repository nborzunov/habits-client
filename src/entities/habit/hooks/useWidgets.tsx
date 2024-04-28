import { layoutState, newLayoutState, newMobileLayoutState } from '@app/store/atoms';
import { useMobile } from '@shared/hooks';
import { Icons$ } from '@shared/lib';
import { useCallback, useEffect, useMemo } from 'react';
import { Layout } from 'react-grid-layout';
import { useRecoilState } from 'recoil';

import { Habit } from '../model/types';

export enum HabitsWidget {
    CURRENT_STREAK = 'CURRENT_STREAK',
    COMPLETED_CHART = 'COMPLETED_CHART',
    COMPLETED_TARGETS = 'COMPLETED_TARGETS',
    FAILED_TARGETS = 'FAILED_TARGETS',
    TOTAL_TARGETS = 'TOTAL_TARGETS',
    SKIPPED_TARGETS = 'SKIPPED_TARGETS',
    YEARLY_CALENDAR = 'YEARLY_CALENDAR',
    MONTHLY_CALENDAR = 'MONTHLY_CALENDAR',
    TOTAL_VALUES = 'TOTAL_VALUES',
    COMPLETED_VALUES = 'COMPLETED_VALUES',
}

export const WIDGETS: {
    [key in HabitsWidget]: {
        getTitle: (habit: Habit) => string;
        icon: any;
        desktop: {
            w: number;
            h: number;
            x: number;
            y: number;
        };
        mobile: {
            w: number;
            h: number;
            x: number;
            y: number;
        };
        isResizable?: boolean;
    };
} = {
    CURRENT_STREAK: {
        getTitle: () => 'habits:currentStreak.base',
        icon: Icons$.Stats,
        desktop: {
            w: 2,
            h: 1,
            x: 0,
            y: 0,
        },
        mobile: {
            w: 2,
            h: 1,
            x: 0,
            y: 0,
        },
    },
    COMPLETED_TARGETS: {
        getTitle: () => 'habits:completedTargets.long',
        icon: Icons$.Stats,
        desktop: {
            w: 1,
            h: 1,
            x: 0,
            y: 1,
        },
        mobile: {
            w: 1,
            h: 1,
            x: 0,
            y: 1,
        },
    },
    FAILED_TARGETS: {
        getTitle: () => 'habits:failedTargets.long',
        icon: Icons$.Stats,
        desktop: {
            w: 1,
            h: 1,
            x: 1,
            y: 1,
        },
        mobile: {
            w: 1,
            h: 1,
            x: 1,
            y: 1,
        },
    },
    TOTAL_TARGETS: {
        getTitle: () => 'habits:totalDays',
        icon: Icons$.Stats,
        desktop: {
            w: 1,
            h: 1,
            x: 0,
            y: 2,
        },
        mobile: {
            w: 1,
            h: 1,
            x: 0,
            y: 2,
        },
    },
    SKIPPED_TARGETS: {
        getTitle: () => 'habits:skippedTargets.long',
        icon: Icons$.Stats,
        desktop: {
            w: 1,
            h: 1,
            x: 1,
            y: 2,
        },
        mobile: {
            w: 1,
            h: 1,
            x: 1,
            y: 2,
        },
    },
    TOTAL_VALUES: {
        getTitle: (habit) => `habits:totalValues.${habit.goal_type}`,
        icon: Icons$.Stats,
        desktop: {
            w: 1,
            h: 1,
            x: 0,
            y: 3,
        },
        mobile: {
            w: 1,
            h: 1,
            x: 0,
            y: 3,
        },
    },
    COMPLETED_VALUES: {
        getTitle: (habit) => `habits:completed_values.${habit.goal_type}`,
        icon: Icons$.Stats,
        desktop: {
            w: 1,
            h: 1,
            x: 1,
            y: 3,
        },
        mobile: {
            w: 1,
            h: 1,
            x: 1,
            y: 3,
        },
    },
    YEARLY_CALENDAR: {
        getTitle: () => 'habits:yearlyCalendar',
        icon: Icons$.Calendar,
        desktop: {
            w: 2,
            h: 3,
            x: 0,
            y: 4,
        },
        mobile: {
            w: 2,
            h: 4,
            x: 0,
            y: 4,
        },
        isResizable: false,
    },
    COMPLETED_CHART: {
        getTitle: () => 'habits:completedChart',
        icon: Icons$.Chart,
        desktop: {
            w: 1,
            h: 3,
            x: 2,
            y: 0,
        },
        mobile: {
            w: 2,
            h: 3,
            x: 0,
            y: 8,
        },
        isResizable: false,
    },
    MONTHLY_CALENDAR: {
        getTitle: () => 'habits:monthlyCalendar',
        icon: Icons$.Calendar,
        desktop: {
            w: 1,
            h: 3.5,
            x: 2,
            y: 5,
        },
        mobile: {
            w: 2,
            h: 3.5,
            x: 0,
            y: 13,
        },
        isResizable: false,
    },
};

export const useWidgets = (habit: Habit, isEditMode: boolean) => {
    const [layouts, setLayouts] = useRecoilState(layoutState);
    const [newLayout, setNewLayout] = useRecoilState(newLayoutState);
    const [newMobileLayout, setNewMobileLayout] = useRecoilState(newMobileLayoutState);

    const isMobile = useMobile();

    const setLayout = useCallback(
        (data: Layout[], dimension: 'desktop' | 'mobile') => {
            setLayouts((current) => ({
                ...current,
                [habit.id]: (() => {
                    const result = { ...current[habit.id] } || {};

                    if (dimension === 'desktop') {
                        result.desktop = data;
                    }
                    if (dimension === 'mobile') {
                        result.mobile = data;
                    }
                    return result;
                })(),
            }));
        },
        [habit.id, setLayouts],
    );

    const filterWidget = useCallback(
        (widget: HabitsWidget) => {
            if (
                !habit.allow_skip &&
                widget in [HabitsWidget.SKIPPED_TARGETS, HabitsWidget.TOTAL_TARGETS]
            ) {
                return false;
            }

            return !(
                !(habit.allow_partial_completion && habit.allow_over_goal_completion) &&
                widget in [HabitsWidget.TOTAL_VALUES, HabitsWidget.COMPLETED_VALUES]
            );
        },
        [habit],
    );

    const layout = useMemo(() => layouts[habit.id]?.['desktop'], [habit, layouts]);
    const mobileLayout = useMemo(() => layouts[habit.id]?.['mobile'], [habit, layouts]);

    const currentWidgetLayout = useMemo(() => {
        if (isEditMode) {
            if (!newLayout.length || !newMobileLayout.length) {
                setNewLayout(layout);
                setNewMobileLayout(mobileLayout);
            }
            return isMobile ? newMobileLayout : newLayout;
        }
        return isMobile ? mobileLayout : layout;
    }, [
        isEditMode,
        isMobile,
        newMobileLayout,
        newLayout,
        mobileLayout,
        layout,
        setNewLayout,
        setNewMobileLayout,
    ]);

    const boostrapLayout = useCallback(
        (dimension: 'desktop' | 'mobile') => {
            const initial = Object.values(HabitsWidget)
                .filter(filterWidget)
                .map((key) => getWidgetConfiguration(key, dimension));

            if (dimension === 'desktop') {
                setNewLayout(initial);
            }
            if (dimension === 'mobile') {
                setNewMobileLayout(initial);
            }

            return initial;
        },
        [filterWidget, setNewLayout, setNewMobileLayout],
    );

    const getWidgetConfiguration = (id: HabitsWidget, dimension: 'desktop' | 'mobile') => {
        const configuration = WIDGETS[id];
        const position = configuration[dimension];

        return {
            ...position,
            isResizable: configuration.isResizable,
            i: id,
            resizeHandles: ['e', 'w'],
        } as Layout;
    };

    const onLayoutChange = useCallback(
        (newLayout: Layout[]) => {
            if (isMobile) {
                setNewMobileLayout(newLayout.map((item) => item));
            } else {
                setNewLayout(newLayout.map((item) => item));
            }
        },
        [isMobile, setNewLayout, setNewMobileLayout],
    );

    const removeWidget = useCallback(
        (id: HabitsWidget) => {
            setNewLayout((layout) => layout.filter((item) => item.i !== id));
            setNewMobileLayout((layout) => layout.filter((item) => item.i !== id));
        },
        [setNewLayout, setNewMobileLayout],
    );

    const addWidget = useCallback(
        (id: HabitsWidget) => {
            setNewLayout((layout) => [...layout, getWidgetConfiguration(id, 'desktop')]);
            setNewMobileLayout((layout) => [...layout, getWidgetConfiguration(id, 'mobile')]);
        },
        [setNewLayout, setNewMobileLayout],
    );

    const saveLayout = useCallback(() => {
        setLayout(newLayout, 'desktop');
        setLayout(newMobileLayout, 'mobile');
    }, [setLayout, newLayout, newMobileLayout]);

    const resetLayout = useCallback(() => {
        setLayout(boostrapLayout('desktop'), 'desktop');
        setLayout(boostrapLayout('mobile'), 'mobile');
    }, [boostrapLayout, setLayout]);

    const widgets = useMemo(
        () =>
            Object.values(HabitsWidget).filter(
                (key) =>
                    (!currentWidgetLayout || !currentWidgetLayout.find((item) => item.i === key)) &&
                    filterWidget(key),
            ),
        [currentWidgetLayout, filterWidget],
    );

    useEffect(() => {
        if (layout) return;

        setLayout(boostrapLayout('mobile'), 'mobile');
        setLayout(boostrapLayout('desktop'), 'desktop');
    }, [layout, setLayout, boostrapLayout]);

    return {
        save: saveLayout,
        reset: resetLayout,
        removeWidget,
        addWidget,
        filterWidget,
        widgets,
        layout: currentWidgetLayout || [],
        props: {
            margin: [16, 16] as [number, number],
            rowHeight: 94,
            isDraggable: isEditMode,
            isResizable: isEditMode && !isMobile,
            onLayoutChange: onLayoutChange,
            layouts: {
                lg: layout,
                md: layout,
                sm: layout,
                xs: mobileLayout,
                xxs: mobileLayout,
            },
            breakpoints: { lg: 1600, md: 1320, sm: 900, xs: 0, xxs: 0 },
            cols: { lg: 3, md: 3, sm: 3, xs: 2, xxs: 2 },
        },
    };
};
