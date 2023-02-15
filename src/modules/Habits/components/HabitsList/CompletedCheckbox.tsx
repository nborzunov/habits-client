import { Icon, IconButton, Tooltip } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Icons from '~/common/helpers/Icons';
import getCorrectDate from '~/common/utils/getCorrectDate';
import { useCreateTarget } from '~/modules/Habits/api/useCreateTarget';
import {
    TargetActionContext,
    TargetActionWrapper,
} from '~/modules/Habits/components/TargetCalendar';
import { Habit, TargetType } from '~/modules/Habits/types';

export const CompletedCheckbox = ({ value, habit }: { value: boolean; habit: Habit }) => {
    const { t } = useTranslation();
    const { mutate: createTarget } = useCreateTarget();

    const onChangeTarget = (
        id: string | undefined,
        date: Date,
        targetType: TargetType,
        value?: number,
    ) => {
        createTarget({
            id: id,
            habitId: habit.id,
            date: getCorrectDate(date),
            targetType: targetType,
            value: value || habit.goal,
        });
    };

    const target = useMemo(
        () =>
            habit.targets.find(
                (t) =>
                    dayjs(t.date).startOf('day').toISOString() ===
                    dayjs().startOf('day').toISOString(),
            ),
        [habit.targets],
    );
    return (
        <Tooltip label={value ? t('habits:uncheck') : t('habits:complete')}>
            <TargetActionContext.Provider
                value={{
                    habit,
                    onChangeTarget,
                    targets: habit.targets,
                }}
            >
                <TargetActionWrapper
                    date={dayjs().startOf('day')}
                    showTooltip={false}
                    target={target}
                >
                    <IconButton
                        borderRadius={'full'}
                        borderWidth={'2px'}
                        variant={value ? 'solid' : 'outline'}
                        colorScheme={'purple'}
                        size={'sm'}
                        icon={<Icon as={Icons.Complete} />}
                        aria-label={'complete'}
                        mr={'2'}
                    />
                </TargetActionWrapper>
            </TargetActionContext.Provider>
        </Tooltip>
    );
};
