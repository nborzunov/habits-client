import { FrequencyType } from '../../../src/entities/habit/model/types';

export const habits = {
    noHabits: 'Пока нет привычек, давайте создадим одну!',
    completed_today: 'Завершено сегодня',
    allHabits: 'Все привычки',
    successfullyCreated: 'Привычка создана!',
    successfullyUpdated: 'Привычка обновлена!',
    successfullyDeletedOne: 'Привычка удалена!',
    successfullyDeleted: 'Привычки удалены!',
    successfullyCleaned: {
        one: 'Данные привычки очищены!',
        all: 'Данные привычек очищены!',
    },
    addHabit: 'Создать',
    selectedHabit: `{{title}} - Привычки`,
    deleteHabit: 'Удалить привычку "{{title}}"',
    deleteHabitDescription: 'Вы уверены? Если вы удалите привычку, вы потеряете весь прогресс.',
    completed_count: '{{count}} выполнено',
    failed_count: '{{count}} провалено',
    cleanTargets: 'Очистить',
    archive: 'Архивировать',
    delete: 'Удалить',
    currentStreak: {
        base: 'Текущая Серия',
        lower: 'Текущая серия',
    },
    completedTargets: {
        title: 'Общий прогресс',
        long: 'Выполненные цели',
        short: 'Выполнено',
    },
    failedTargets: {
        long: 'Проваленные цели',
        short: 'Провалено',
    },
    totalDays: 'Дней выполнено',
    totalValues: {
        mins: 'Всего минут',
        times: 'Всего повторений',
    },
    completed_values: {
        mins: 'Выполнено минут',
        times: 'Выполнено повторений',
    },
    skippedTargets: {
        long: 'Пропущенные цели',
        short: 'Пропущено',
    },
    yearlyCalendar: 'Годовой календарь',
    monthlyCalendar: 'Месячный календарь',
    completedChart: 'График выполнения',
    widgets: 'Виджеты',
    noWidgets: 'Виджетов не осталось',
    addWidgets: 'Добавить все виджеты',
    addWidget: 'Добавить виджет',
    editGrid: 'Редактировать сетку',
    editHabit: 'Редактировать привычку "{{title}}"',
    newHabit: 'Новая привычка',
    title: 'Название',
    dailyGoal: 'Ежедневная цель',
    increaseDailyGoal: 'Нужно увеличить ежедневную цель',
    goal_type: 'Тип цели',
    timesTitle: 'Повторения',
    minutesTitle: 'Минуты',
    frequencyType: 'Периодичность',
    frequencyTypeOptions: {
        [FrequencyType.Daily]: 'Ежедневно',
        [FrequencyType.Weekly]: 'Еженедельно',
        [FrequencyType.Monthly]: 'Ежемесячно',
        [FrequencyType.Custom]: 'Любая',
    },
    allowOverGoal: 'Разрешить превышение цели',
    allowPartial: 'Разрешить частичное выполнение',
    allow_skip: 'Разрешить пропуски',
    allow_skipDescription: '(например, если необходимо время на отдых)',
    setResult: '{{title}} - Установите результат сегодня',
    operations: {
        set: 'Установить',
        complete: 'Завершить',
        skip: 'Пропустить',
        clear: 'Очистить',
        uncheck: 'Снять отметку',
    },
    completedOn: '{{prefix}} {{date}}',
    skipOn: 'Пропущено {{date}}',
    targets_one: '1 выполнение',
    targets_other: '{{count}} выполнений',
    currentWeek: 'Текущая неделя',
    goal: 'Цель',
    can_be_finished: 'Можно завершить',
    finishIf: 'Завершить, если ',
    chartNoData: 'Нет данных для отображения',
};
