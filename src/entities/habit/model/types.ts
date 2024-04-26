export interface Habit {
    id: string;
    title: string;
    periodicity: Periodicity;
    periodicityValue?: string;
    goal: number;
    goal_type: GoalType;
    created_date: Date;
    start_date: Date;
    allow_skip: boolean;
    allow_partial_completion: boolean;
    allow_over_goal_completion: boolean;
    can_be_finished: boolean;
    total_goal: number;
    statistics: TargetStatistics;
    targets: Target[];
}

export interface TargetStatistics {
    current_streak_start_date?: Date;
    current_streak_count: number;
    current_streak_count_this_week: number;
    current_streak_values: number;
    current_streak_values_this_week: number;
    failed_count: number;
    failed_count_this_week: number;
    skipped_count: number;
    skipped_count_this_week: number;
    total_count: number;
    total_count_this_week: number;
    total_values_count: number;
    total_values_count_this_week: number;
    completed_count: number;
    completed_count_this_week: number;
    completed_values: number;
    completed_values_this_week: number;
    completed_today: boolean;
}

export type HabitData = Omit<
    Habit,
    'id' | 'statistics' | 'targets' | 'created_date' | 'start_date'
>;

export interface Target {
    id: string;
    date: Date;
    created_date: Date;
    target_type: TargetType;
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
    habit_id: string;
    date: Date;
    target_type: string;
    value: number;
}
