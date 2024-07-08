export {
    type Habit,
    type HabitData,
    type Target,
    FrequencyType,
    type GridHabit,
    type TodaysHabit,
} from './model/types';
export { useWidgets } from './hooks/useWidgets';
export * from './api';
export { habitsState } from './store/atoms';
export { uncompletedHabitsState, completedHabitsState } from './store/selectors';

// TODO; remove
export enum TargetType {
    Times = 'times',
    Mins = 'mins',
}
