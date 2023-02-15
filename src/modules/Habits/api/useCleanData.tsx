import { useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useSetRecoilState } from 'recoil';
import api from '~/common/helpers/api';
import { habitsState } from '~/common/store/atoms';

export const useCleanData = (habitId: string, onClose: () => void) => {
    const setHabits = useSetRecoilState(habitsState);
    const { t } = useTranslation();
    const toast = useToast();

    return useMutation({
        mutationFn: () => {
            return api
                .put(`habits/${habitId}/clean`)
                .then(() => {
                    setHabits((prev) =>
                        prev.map((h) => ({
                            ...h,
                            targets: h.id === habitId ? [] : h.targets,
                        })),
                    );
                    onClose();
                })
                .then(() =>
                    toast({
                        title: t('common:success'),
                        description: t('habits:successfullyCleaned.all'),
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
