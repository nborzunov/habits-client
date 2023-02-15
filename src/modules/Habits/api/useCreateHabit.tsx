import { useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useSetRecoilState } from 'recoil';
import api from '~/common/helpers/api';
import { habitsState } from '~/common/store/atoms';
import { Habit, HabitData } from '~/modules/Habits/types';

export const useCreateHabit = (onClose: () => void) => {
    const setHabits = useSetRecoilState(habitsState);
    const { t } = useTranslation();
    const toast = useToast();

    return useMutation({
        mutationFn: (data: HabitData) =>
            api
                .post('habits/', { json: data })
                .json<Habit>()
                .then((newHabit) => setHabits((prev) => [newHabit, ...prev]))
                .then(() =>
                    toast({
                        title: t('common:success'),
                        description: t('habits:successfullyCreated'),
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
                .finally(() => {
                    onClose();
                }),
    });
};
