import { useToast } from '@chakra-ui/react';
import api from '@shared/lib/api';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { useSetRecoilState } from 'recoil';

import { Habit } from '../model/types';
import { habitsState } from '../store/atoms';

export const useArchiveHabit = (habitId: string, onClose: () => void) => {
    const setHabits = useSetRecoilState(habitsState);
    const { habitId: selectedHabitId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const toast = useToast();

    return useMutation({
        mutationFn: () => {
            return api
                .put(`habits/${habitId}/archive/`)
                .json<Habit>()
                .then(() => {
                    setHabits((prev) => prev.filter((h) => h.id !== habitId));
                    if (selectedHabitId === habitId) {
                        navigate('/habits');
                    }
                })
                .then(() =>
                    toast({
                        title: t('common:success'),
                        description: t('habits:successfully'),
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
