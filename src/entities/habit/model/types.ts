export interface Habit {
    id: string;
    user_id: string;
    name: string;
    color: string;
    icon: string;
    amount: number;
    goal: number;
    frequencyType: 'daily' | 'weekly' | 'monthly' | 'interval';
    frequencyAmount: number[];
    targets: Target[];
}

export interface HabitData {
    name: string;
    color: string;
    icon: string;
    amount: number;
    goal: number;
    frequencyType: 'daily' | 'weekly' | 'monthly' | 'interval';
    frequencyAmount: number[];
}

export interface Target {
    id: string;
    habit_id: string;
    user_id: string;
    date: Date;
    amount: number;
}

export enum FrequencyType {
    Daily = 'daily',
    Weekly = 'weekly',
    Monthly = 'monthly',
    Interval = 'interval',
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
