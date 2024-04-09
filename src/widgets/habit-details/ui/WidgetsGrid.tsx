import { Box } from '@chakra-ui/react';
import { useCreateTarget } from '@entities/habit/api/useCreateTarget';
import { HabitsWidget, useWidgets } from '@entities/habit/hooks/useWidgets';
import { Habit, TargetType } from '@entities/habit/model/types';
import { TargetActionContext } from '@features/target-calendar';
import { getCorrectDate } from '@shared/lib';
import { useCallback } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';

import { Widget } from './Widget';

const GridLayout = WidthProvider(Responsive);

export const WidgetsGrid = ({ habit, isEditMode }: { habit: Habit; isEditMode: boolean }) => {
    const { removeWidget, layout, props } = useWidgets(habit, isEditMode);

    const { mutate: createTarget } = useCreateTarget();

    const onChangeTarget = useCallback(
        (id: string | undefined, date: Date, targetType: TargetType, value?: number) => {
            createTarget({
                id: id,
                habitId: habit.id,
                date: getCorrectDate(date),
                targetType: targetType,
                value: value || habit.goal,
            });
        },
        [createTarget, habit.goal, habit.id],
    );

    return (
        <Box userSelect={isEditMode ? 'none' : 'auto'}>
            <TargetActionContext.Provider
                value={{
                    habit,
                    onChangeTarget,
                    targets: habit.targets,
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
                            <Widget
                                isEditMode={isEditMode}
                                remove={removeWidget}
                                id={widget.i as HabitsWidget}
                                habit={habit}
                            />
                        </Box>
                    ))}
                </GridLayout>
            </TargetActionContext.Provider>
        </Box>
    );
};
