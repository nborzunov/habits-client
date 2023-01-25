import { Icon, IconButton, Tooltip } from '@chakra-ui/react';
import Icons from '~/common/helpers/Icons';
import { CreateTargetData, Habit, TargetType } from '~/Habits/types';
import { useMutation } from '@tanstack/react-query';
import api from '~/common/helpers/api';
import { habitsState } from '~/common/store/atoms';
import { useSetRecoilState } from 'recoil';
import dayjs from 'dayjs';
import TargetActionWrapper from '~/Habits/components/TargetCalendar/TargetActionWrapper';
import TargetActionContext from '~/Habits/components/TargetCalendar/TargetActionContext';
import getCorrectDate from '~/common/utils/getCorrectDate';
import { useMemo } from 'react';

const CompletedCheckbox = ({ value, habit }: { value: boolean; habit: Habit }) => {
    const setHabits = useSetRecoilState(habitsState);

    const createTarget = useMutation({
        mutationFn: (data: CreateTargetData) => {
            return api
                .post<Habit>('/targets/', data)
                .then((res) => res.data)
                .then((newHabit) =>
                    setHabits((prev) => prev.map((h) => (h.id !== newHabit.id ? h : newHabit))),
                );
        },
    });

    const onChangeTarget = (
        id: string | undefined,
        date: Date,
        targetType: TargetType,
        value?: number,
    ) => {
        createTarget.mutate({
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
        <Tooltip label={value ? 'Uncheck' : 'Complete'}>
            <TargetActionContext.Provider
                value={{
                    habit,
                    onChangeTarget,
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

export default CompletedCheckbox;
