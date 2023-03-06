export type AchievementKey =
    | 'streakStarter'
    | 'habitFormed'
    | 'consistencyChampion'
    | 'habitualHero'
    | 'habitMaster'
    | 'habitProdigy'
    | 'habitLegend'
    | 'steadyEddie'
    | 'relentless'
    | 'unstoppable'
    | 'surpassingLimits'
    | 'perseverance'
    | 'comebackKid';

export interface AchievementData {
    readonly key: AchievementKey;
    readonly goal?: number;
    readonly color: string;
}

export interface AchievementProgress {
    habitId: string;
    habitTitle: string;
    progress: number;
}

export interface BaseAchievement {
    key: AchievementKey;
    progress: AchievementProgress[];
    completed: boolean;
    completedDate?: Date;
}

export interface Achievement extends BaseAchievement {
    goal?: number;
    color: string;
}
