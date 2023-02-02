import { useCallback, useEffect, useMemo, useState } from 'react';
import { Layout } from 'react-grid-layout';
import { useRecoilState } from 'recoil';
import Icons from '~/common/helpers/Icons';
import useMobile from '~/common/hooks/useMobile';
import { layoutState } from '~/common/store/atoms';
import { Habit } from '~/modules/Habits/types';

export enum WidgetIdentifiers {
    CURRENT_STREAK = 'CURRENT_STREAK',
    COMPLETED_CHART = 'COMPLETED_CHART',
    COMPLETED_TARGETS = 'COMPLETED_TARGETS',
    FAILED_TARGETS = 'FAILED_TARGETS',
    TOTAL_TARGETS = 'TOTAL_TARGETS',
    SKIPPED_TARGETS = 'SKIPPED_TARGETS',
    YEARLY_CALENDAR = 'YEARLY_CALENDAR',
    MONTHLY_CALENDAR = 'MONTHLY_CALENDAR',
}

export const WIDGETS: {
    [key in WidgetIdentifiers]: {
        title: string;
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
        title: 'Current Streak',
        icon: Icons.Stats,
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
        title: 'Completed Targets',
        icon: Icons.Stats,
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
        title: 'Failed Targets',
        icon: Icons.Stats,
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
        title: 'Total Targets',
        icon: Icons.Stats,
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
        title: 'Skipped Targets',
        icon: Icons.Stats,
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
    YEARLY_CALENDAR: {
        title: 'Yearly Calendar',
        icon: Icons.Calendar,
        desktop: {
            w: 2,
            h: 1.5,
            x: 0,
            y: 3,
        },
        mobile: {
            w: 2,
            h: 4,
            x: 0,
            y: 3,
        },
        isResizable: false,
    },
    COMPLETED_CHART: {
        title: 'Completed Chart',
        icon: Icons.Chart,
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
            y: 7,
        },
        isResizable: false,
    },
    MONTHLY_CALENDAR: {
        title: 'Monthly Calendar',
        icon: Icons.Calendar,
        desktop: {
            w: 1,
            h: 4,
            x: 2,
            y: 4,
        },
        mobile: {
            w: 2,
            h: 3.5,
            x: 0,
            y: 12,
        },
        isResizable: false,
    },
};

export const useWidgets = (habit: Habit, isEditMode: boolean) => {
    const [layouts, setLayouts] = useRecoilState(layoutState);
    const [newLayout, setNewLayout] = useState<Layout[]>([]);
    const [newMobileLayout, setNewMobileLayout] = useState<Layout[]>([]);

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
        (widget: WidgetIdentifiers) => {
            if (
                !habit.allowSkip &&
                (widget === WidgetIdentifiers.TOTAL_TARGETS ||
                    widget === WidgetIdentifiers.SKIPPED_TARGETS)
            ) {
                return false;
            }

            return !(
                !habit.completedTargets &&
                !habit.failedTargets &&
                widget === WidgetIdentifiers.COMPLETED_CHART
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
    }, [isEditMode, isMobile, newMobileLayout, newLayout, mobileLayout, layout]);

    const boostrapLayout = useCallback(
        (dimension: 'desktop' | 'mobile') => {
            const initial = Object.values(WidgetIdentifiers)
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

    const getWidgetConfiguration = (id: WidgetIdentifiers, dimension: 'desktop' | 'mobile') => {
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
        (id: WidgetIdentifiers) => {
            setNewLayout((layout) => layout.filter((item) => item.i !== id));
            setNewMobileLayout((layout) => layout.filter((item) => item.i !== id));
        },
        [setNewMobileLayout],
    );

    const addWidget = useCallback(
        (id: WidgetIdentifiers) => {
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
            Object.values(WidgetIdentifiers).filter(
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
            className: 'layout',
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
