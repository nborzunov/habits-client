import { useCallback, useEffect, useMemo, useState } from 'react';
import { Layout } from 'react-grid-layout';
import { useRecoilState } from 'recoil';
import Icons from '~/common/helpers/Icons';
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

export type LayoutSizes = 'sm' | 'lg';
const layoutWidth = 3;
const layoutHeight = 94;

export const WIDGETS: {
    [key in WidgetIdentifiers]: {
        title: string;
        icon: any;
        w: number;
        h: number;
    };
} = {
    CURRENT_STREAK: { title: 'Current Streak', icon: Icons.Stats, w: 2, h: 1 },
    COMPLETED_TARGETS: { title: 'Completed Targets', icon: Icons.Stats, w: 1, h: 1 },
    FAILED_TARGETS: { title: 'Failed Targets', icon: Icons.Stats, w: 1, h: 1 },
    TOTAL_TARGETS: { title: 'Total Targets', icon: Icons.Stats, w: 1, h: 1 },
    SKIPPED_TARGETS: { title: 'Skipped Targets', icon: Icons.Stats, w: 1, h: 1 },
    YEARLY_CALENDAR: { title: 'Yearly Calendar', icon: Icons.Calendar, w: 2, h: 2 },
    COMPLETED_CHART: { title: 'Completed Chart', icon: Icons.Chart, w: 1, h: 3 },
    MONTHLY_CALENDAR: { title: 'Monthly Calendar', icon: Icons.Calendar, w: 1, h: 3.5 },
};
const WIDGET_LAYOUTS = {
    CURRENT_STREAK: {
        lg: { x: 0, y: 0 },
    },
    COMPLETED_TARGETS: {
        lg: { x: 0, y: 1 },
    },
    FAILED_TARGETS: {
        lg: {
            x: 1,
            y: 1,
            w: 1,
            h: 1,
        },
    },
    TOTAL_TARGETS: {
        lg: { x: 0, y: 2 },
    },
    SKIPPED_TARGETS: {
        lg: { x: 1, y: 2 },
    },
    YEARLY_CALENDAR: {
        lg: { x: 0, y: 2, isResizable: false },
    },
    COMPLETED_CHART: {
        lg: {
            x: 2,
            y: 0,
            isResizable: false,
        },
    },
    MONTHLY_CALENDAR: {
        lg: {
            x: 2,
            y: 4,
            isResizable: false,
        },
    },
};

export const useWidgets = (habit: Habit, isEditMode: boolean) => {
    const [layouts, setLayouts] = useRecoilState(layoutState);
    const [newLayout, setNewLayout] = useState<Layout[]>([]);

    const layout = useMemo(() => layouts[habit.id], [habit, layouts]);

    const setLayout = useCallback(
        (newLayout: Layout[]) => {
            setLayouts((current) => ({
                ...current,
                [habit.id]: newLayout,
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

    const boostrapLayout = useCallback(() => {
        const initial = Object.entries(WIDGET_LAYOUTS)
            .map(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                ([key, values]: [WidgetIdentifiers, any]) => {
                    const defaultSize = WIDGETS[key];
                    return {
                        i: key,
                        ...values[Object.keys(values).shift() as LayoutSizes],
                        w: defaultSize.w,
                        h: defaultSize.h,
                        resizeHandles: ['e', 'w'],
                    };
                },
            )
            .filter((item) => filterWidget(item.i as WidgetIdentifiers)) as Layout[];

        setNewLayout(initial);

        return initial;
    }, [filterWidget]);

    const onLayoutChange = (newLayout: Layout[]) => {
        setNewLayout(newLayout.map((item) => item));
    };

    const removeWidget = (id: WidgetIdentifiers) => {
        setNewLayout(currentWidgetLayout.filter((item) => item.i !== id));
    };
    const addWidget = (id: WidgetIdentifiers) => {
        setNewLayout([...currentWidgetLayout, { i: id, ...WIDGET_LAYOUTS[id].lg, ...WIDGETS[id] }]);
    };

    const saveLayout = () => {
        setLayout(newLayout);
    };

    const resetLayout = () => {
        boostrapLayout();
    };

    const currentWidgetLayout = (isEditMode ? newLayout : layout) as Layout[];

    const widgets = Object.values(WidgetIdentifiers).filter(
        (key) =>
            (!currentWidgetLayout || !currentWidgetLayout.find((item) => item.i === key)) &&
            filterWidget(key),
    );

    useEffect(() => {
        if (layout) return;
        setLayout(boostrapLayout());
    }, [layout, setLayout, boostrapLayout]);

    return {
        save: saveLayout,
        reset: resetLayout,
        removeWidget,
        addWidget,
        filterWidget,
        widgets,
        layout: isEditMode ? newLayout : layout || [],
        props: {
            className: 'layout',
            cols: layoutWidth,
            margin: [16, 16] as [number, number],
            rowHeight: layoutHeight,
            width: 1600,
            isDraggable: isEditMode,
            isResizable: isEditMode,
            onLayoutChange: onLayoutChange,
        },
    };
};
