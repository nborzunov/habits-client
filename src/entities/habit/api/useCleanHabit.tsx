import { useToast } from '@chakra-ui/react';
import api from '@shared/lib/api';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useSetRecoilState } from 'recoil';

import { Habit } from '../model/types';
import { habitsState } from '../store/atoms';

export const useCleanHabit = (habitId: string) => {
    const setHabits = useSetRecoilState(habitsState);
    const { t } = useTranslation();
    const toast = useToast();

    return useMutation({
        mutationFn: () => {
            return api
                .put(`habits/${habitId}/clean`)
                .json<Habit>()
                .then((updatedHabit) => {
                    setHabits((prev) => prev.map((h) => (h.id === habitId ? updatedHabit : h)));
                })
                .then(() =>
                    toast({
                        title: t('common:success'),
                        description: t('habits:successfullyCleaned.one'),
                        status: 'success',
                        duration: 1000,
                        isClosable: true,
                    }),
                )
                .catch(() => {
                    toast({
                        title: t('common:error'),
                        description: t('common:serverError'),
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                });
        },
    });
};
