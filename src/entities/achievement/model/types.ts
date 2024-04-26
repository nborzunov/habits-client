export type AchievementKey =
    | 'StreakStarter'
    | 'HabitFormed'
    | 'ConsistencyChampion'
    | 'HabitualHero'
    | 'HabitMaster'
    | 'HabitProdigy'
    | 'HabitLegend'
    | 'SteadyEddie'
    | 'Relentless'
    | 'Unstoppable'
    | 'SurpassingLimits'
    | 'Perseverance'
    | 'ComebackKid';

export interface AchievementData {
    readonly key: AchievementKey;
    readonly goal?: number;
    readonly color: string;
}

export interface AchievementProgress {
    habit_id: string;
    habit_title: string;
    progress: number;
}

export interface BaseAchievement {
    key: AchievementKey;
    progress: AchievementProgress[];
    completed: boolean;
    completed_date?: Date;
}

export interface Achievement extends BaseAchievement {
    goal?: number;
    color: string;
}
