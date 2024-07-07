export interface Habit {
    id: string;
    user_id: string;
    name: string;
    color: string;
    icon: string;
    amount: number;
    goal: number;
    frequency_type: 'daily' | 'weekly' | 'monthly' | 'interval';
    frequency_amount: number[];
    targets: Target[];
}

export interface HabitData {
    name: string;
    color: string;
    icon: string;
    amount: number;
    goal: number;
    frequency_type: 'daily' | 'weekly' | 'monthly' | 'interval';
    frequency_amount: number[];
}

export interface Target {
    id: string;
    habit_id: string;
    user_id: string;
    date: string;
    amount: number;
    current_streak: number;
}

export enum FrequencyType {
    Daily = 'daily',
    Weekly = 'weekly',
    Monthly = 'monthly',
    Interval = 'interval',
}

export interface CreateTargetData {
    habit_id: string;
    date: string;
    amount: number;
}

export type TodaysHabit = {
    id: string;
    name: string;
    icon: string;
    color: string;
    progress: number;
};
export type GridHabit = Habit & {
    current_streak: number;
    longest_streak: number;
    total_count: number;
};
