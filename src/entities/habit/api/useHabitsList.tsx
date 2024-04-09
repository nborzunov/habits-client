import api from '@/shared/lib/api';
import { activeUserState } from '@entities/auth';
import { useQuery } from '@tanstack/react-query';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { Habit } from '../model/types';
import { habitsState } from '../store/atoms';

export const useHabitsList = () => {
    const activeUser = useRecoilValue(activeUserState);
    const setHabits = useSetRecoilState(habitsState);

    return useQuery<Habit[]>({
        queryKey: ['habits'],
        queryFn: () =>
            api
                .get('habits/')
                .json<Habit[]>()
                .then((data) => {
                    setHabits(data);
                    return data;
                }),
        initialData: [],
        enabled: !!activeUser,
    });
};
