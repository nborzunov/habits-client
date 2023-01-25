import { Habit, TargetType } from '~/Habits/types';
import React from 'react';

interface TargetActionContext {
    habit: Habit;
    onChangeTarget: (
        id: string | undefined,
        date: Date,
        targetType: TargetType,
        value?: number,
    ) => void;
}

const TargetActionContext = React.createContext<TargetActionContext>({} as any);

export default TargetActionContext;
