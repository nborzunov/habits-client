import { useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useSetRecoilState } from 'recoil';
import api from '~/common/helpers/api';
import { habitsState } from '~/common/store/atoms';

export const useCleanData = (onClose: () => void) => {
    const setHabits = useSetRecoilState(habitsState);
    const { t } = useTranslation();
    const toast = useToast();

    return useMutation({
        mutationFn: () => {
            return api
                .post(`habits/clean`)
                .then(() =>
                    setHabits((prev) =>
                        prev.map((h) => ({
                            ...h,
                            targets: [],
                        })),
                    ),
                )
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
                })
                .finally(() => onClose());
        },
    });
};
