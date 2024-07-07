export const FEATURE_FLAGS = {
    HABITS: import.meta.env.VITE_HABITS_ENABLED === '1',
    FINANCE: import.meta.env.VITE_FINANCE_ENABLED === '1',
    ACHIEVEMENTS: import.meta.env.VITE_ACHIEVEMENTS_ENABLED === '1',
    SETTINGS: import.meta.env.VITE_SETTINGS_ENABLED === '1',
    PROFILE: import.meta.env.VITE_PROFILE_ENABLED === '1',
};
