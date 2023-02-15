import { useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { useSetRecoilState } from 'recoil';
import api from '~/common/helpers/api';
import { habitsState } from '~/common/store/atoms';
import { Habit } from '~/modules/Habits/types';

export const useDeleteHabit = (habitId: string, onClose: () => void) => {
    const setHabits = useSetRecoilState(habitsState);
    const { habitId: selectedHabitId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const toast = useToast();

    return useMutation({
        mutationFn: () => {
            return api
                .delete(`habits/${habitId}`)
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
                        description: t('habits:successfullyDeletedOne'),
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
