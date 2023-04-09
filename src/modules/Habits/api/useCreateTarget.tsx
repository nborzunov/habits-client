import { useMutation } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';
import api from '~/common/helpers/api';
import { habitsState } from '~/common/store/atoms';
import { CreateTargetData, Habit } from '~/modules/Habits/types';

export const useCreateTarget = () => {
    const setHabits = useSetRecoilState(habitsState);

    return useMutation({
        mutationFn: (data: CreateTargetData) => {
            return api
                .post('targets/', { json: data })
                .json<Habit>()
                .then((newHabit) =>
                    setHabits((prev) => prev.map((h) => (h.id !== newHabit.id ? h : newHabit))),
                );
        },
    });
};
