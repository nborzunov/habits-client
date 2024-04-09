import { useToast } from '@chakra-ui/react';
import api from '@shared/lib/api';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useSetRecoilState } from 'recoil';

import { Habit, HabitData } from '../model/types';
import { habitsState } from '../store/atoms';

export const useEditHabit = (habitId: string, onClose: () => void) => {
    const setHabits = useSetRecoilState(habitsState);
    const { t } = useTranslation();
    const toast = useToast();

    return useMutation({
        mutationFn: (data: HabitData) => {
            return api
                .put(`habits/${habitId}`, { json: data })
                .json<Habit>()
                .then((newHabit) => {
                    setHabits((prev) => prev.map((h) => (h.id === habitId ? newHabit : h)));
                })
                .then(() =>
                    toast({
                        title: t('common:success'),
                        description: t('habits:successfullyUpdated'),
                        status: 'success',
                        duration: 1000,
                        isClosable: true,
                    }),
                )
                .catch((err) =>
                    toast({
                        title: t('common:error'),
                        description:
                            err.status === 401
                                ? t('common:invalidCredentials')
                                : t('common:serverError'),
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    }),
                )
                .finally(() => onClose());
        },
    });
};
