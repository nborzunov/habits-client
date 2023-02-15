import { useQuery } from '@tanstack/react-query';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import api from '~/common/helpers/api';
import { activeUserState, habitsState } from '~/common/store/atoms';
import { Habit } from '~/modules/Habits/types';

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
