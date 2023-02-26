export interface Habit {
    id: string;
    title: string;
    periodicity: Periodicity;
    periodicityValue?: string;
    goal: number;
    goalType: GoalType;
    createDate: Date;
    startDate: Date;
    allowSkip: boolean;
    allowPartialCompletion: boolean;
    allowOverGoalCompletion: boolean;
    canBeFinished: boolean;
    totalGoal: number;
    statistics: TargetStatistics;
    targets: Target[];
}

export interface TargetStatistics {
    currentStreakStartDate?: Date;
    currentStreakCount: number;
    currentStreakCountThisWeek: number;
    currentStreakValues: number;
    currentStreakValuesThisWeek: number;
    failedCount: number;
    failedCountThisWeek: number;
    skippedCount: number;
    skippedCountThisWeek: number;
    totalCount: number;
    totalCountThisWeek: number;
    totalValuesCount: number;
    totalValuesCountThisWeek: number;
    completedCount: number;
    completedCountThisWeek: number;
    completedValues: number;
    completedValuesThisWeek: number;
    completedToday: boolean;
}

export type HabitData = Omit<Habit, 'id' | 'statistics' | 'targets' | 'createDate' | 'startDate'>;

export interface Target {
    id: string;
    date: Date;
    createDate: Date;
    targetType: TargetType;
    value: number;
}

export enum Periodicity {
    Daily = 'daily',
    Weekly = 'weekly',
    Monthly = 'monthly',
    Custom = 'custom',
}

export enum GoalType {
    Times = 'times',
    Mins = 'mins',
}

export enum TargetType {
    Done = 'done',
    Skip = 'skip',
    Empty = 'empty',
}

export interface CreateTargetData {
    id: string | undefined;
    habitId: string;
    date: Date;
    targetType: string;
    value: number;
}
