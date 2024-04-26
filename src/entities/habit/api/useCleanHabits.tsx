import api from '@/shared/lib/api';
import { useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useSetRecoilState } from 'recoil';

import { habitsState } from '../store/atoms';

export const useCleanHabits = () => {
    const setHabits = useSetRecoilState(habitsState);
    const { t } = useTranslation();
    const toast = useToast();

    return useMutation({
        mutationFn: () => {
            return api
                .post(`targets/clean`)
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
