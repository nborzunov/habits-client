import api from '@shared/lib/api';
import { useMutation } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import { CreateTargetData, Habit } from '../model/types';
import { habitsState } from '../store/atoms';

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
