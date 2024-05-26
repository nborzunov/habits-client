import { FrequencyType } from '../../../src/entities/habit/model/types';

export const habits = {
    noHabits: "No habits yet, let's create one!",
    completed_today: 'Completed today',
    allHabits: 'All Habits',
    successfullyCreated: 'Habit created!',
    successfullyUpdated: 'Habit updated!',
    successfullyDeletedOne: 'Habit deleted!',
    successfullyDeleted: 'Habits deleted!',
    successfullyCleaned: {
        one: 'Habit data cleaned!',
        all: 'Habits data cleaned!',
    },
    addHabit: 'Add habit',
    selectedHabit: `{{title}} - Habits`,
    deleteHabit: 'Delete Habit "{{title}}"',
    deleteHabitDescription:
        'Are you sure? If you delete this habit, you will lose all your progress.',
    completed_count: '{{count}} completed',
    failed_count: '{{count}} failed',
    cleanTargets: 'Clean Targets',
    archive: 'Archive',
    delete: 'Delete',
    currentStreak: {
        base: 'Current Streak',
        lower: 'Current streak',
    },
    completedTargets: {
        title: 'Overall Progress',
        long: 'Completed Targets',
        short: 'Completed',
    },
    failedTargets: {
        long: 'Failed Targets',
        short: 'Failed',
    },
    totalDays: 'Total Days',
    totalValues: {
        mins: 'Total Minutes',
        times: 'Total Times',
    },
    completed_values: {
        mins: 'Completed Minutes',
        times: 'Completed Times',
    },
    skippedTargets: {
        long: 'Skipped Targets',
        short: 'Skipped',
    },
    yearlyCalendar: 'Yearly Calendar',
    monthlyCalendar: 'Monthly Calendar',
    completedChart: 'Completed Chart',
    widgets: 'Widgets',
    noWidgets: 'No widgets left',
    addWidgets: 'Add All Widgets',
    addWidget: 'Add Widget',
    editGrid: 'Edit grid',
    editHabit: 'Edit Habit "{{title}}"',
    newHabit: 'New Habit',
    title: 'Title',
    dailyGoal: 'Daily Goal',
    increaseDailyGoal: 'Please increase your daily goal',
    goal_type: 'Goal Type',
    timesTitle: 'Times',
    minutesTitle: 'Minutes',
    frequencyType: 'FrequencyType',
    frequencyTypeOptions: {
        [FrequencyType.Daily]: 'Daily',
        [FrequencyType.Weekly]: 'Weekly',
        [FrequencyType.Monthly]: 'Monthly',
        [FrequencyType.Interval]: 'Interval',
    },
    allowOverGoal: 'Allow overgoal completion',
    allowPartial: 'Allow partial completion',
    allow_skip: 'Allow skip specific days',
    allow_skipDescription: '(e.g. if you need some time to rest)',
    setResult: "{{title}} - Set Today's Result",
    operations: {
        set: 'Set',
        complete: 'Complete',
        skip: 'Skip',
        clear: 'Clear',
        uncheck: 'Uncheck',
    },
    completedOn: '{{prefix}} on {{date}}',
    skipOn: 'Skip on {{date}}',
    currentWeek: 'Current week',
    goal: 'Goal',
    can_be_finished: 'Can be finished',
    finishIf: 'Finish if ',
    chartNoData: 'No data to show',
    createNewHabit: 'Create new habit',
    todaysHabits: 'Todays Habits',
    frequencyType: 'Frequency',
    repeatEveryday: 'Repeat every day',
    weeklyFrequencyType: {
        1: '1 day per week',
        2: '2 days per week',
        3: '3 days per week',
        4: '4 days per week',
        5: '5 days per week',
        6: '6 days per week',
        7: 'Every day',
    },
    monthlyFrequencyType: {
        1: '1 day per month',
        2: '2 days per month',
        3: '3 days per month',
        4: '4 days per month',
        5: '5 days per month',
        6: '6 days per month',
        7: '7 days per month',
    },
    setCustomInterval: 'Set custom interval',
    amountTitle: 'Amount',
    amountCount_zero: '{{count}} times',
    amountCount_one: '{{count}} time',
    amountCount_few: '{{count}} times',
    amountCount_many: '{{count}} times',
    amountCount_other: '{{count}} times',
    amount_zero: 'times',
    amount_one: 'time',
    amount_few: 'times',
    amount_many: 'times',
    amount_other: 'times',
    goalTitle: 'Goal',
    goalCount_zero: '{{count}} days',
    goalCount_one: '{{count}} day',
    goalCount_few: '{{count}} days',
    goalCount_many: '{{count}} days',
    goalCount_other: '{{count}} days',
    goal_zero: 'days',
    goal_one: 'day',
    goal_few: 'days',
    goal_many: 'days',
    goal_other: 'days',
    nameRequired: 'Please enter a name',
    iconRequired: 'Please select an icon',
};
