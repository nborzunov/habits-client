import { Box, Icon, IconButton, Tooltip } from '@chakra-ui/react';
import { useCreateTarget } from '@entities/habit/api/useCreateTarget';
import { Habit, TargetType } from '@entities/habit/model/types';
import { TargetAction, TargetActionContext } from '@features/target-calendar';
import { Icons$, getCorrectDate } from '@shared/lib';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const CompletedCheckbox = ({
    value,
    habit,
    innerRef,
}: {
    value: boolean;
    habit: Habit;
    innerRef: any;
}) => {
    const { t } = useTranslation();
    const { mutate: createTarget } = useCreateTarget();

    const onChangeTarget = (
        id: string | undefined,
        date: Date,
        target_type: TargetType,
        value?: number,
    ) => {
        createTarget({
            id: id,
            habit_id: habit.id,
            date: getCorrectDate(date),
            target_type: target_type,
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
        <Box ref={innerRef}>
            <Tooltip label={value ? t('habits:uncheck') : t('habits:complete')}>
                <TargetActionContext.Provider
                    value={{
                        habit,
                        onChangeTarget,
                        targets: habit.targets,
                    }}
                >
                    <TargetAction date={dayjs().startOf('day')} showTooltip={false} target={target}>
                        <IconButton
                            borderRadius={'full'}
                            borderWidth={'2px'}
                            variant={value ? 'solid' : 'outline'}
                            colorScheme={'purple'}
                            size={'sm'}
                            icon={<Icon as={Icons$.Complete} />}
                            aria-label={'complete'}
                            mr={'2'}
                        />
                    </TargetAction>
                </TargetActionContext.Provider>
            </Tooltip>
        </Box>
    );
};
