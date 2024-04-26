import { useToast } from '@chakra-ui/react';
import { useTransactions } from '@entities/transaction';
import api from '@shared/lib/api';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { useCategories } from './useCategories';

export const useDeleteCategory = () => {
    const { t } = useTranslation();
    const toast = useToast();

    const { refetch: refetchCategories } = useCategories();
    const { refetch: refetchTransactions } = useTransactions();

    return useMutation({
        mutationFn: (category_id: string) => {
            return api
                .delete(`category/${category_id}`)
                .text()
                .then(() => {
                    refetchCategories();
                    refetchTransactions();
                    toast({
                        title: t('common:success'),
                        description: t('finance:categories.categoryDeleted'),
                        status: 'success',
                        duration: 1000,
                        isClosable: true,
                    });
                })
                .catch((err) => {
                    toast({
                        title: t('common:error'),
                        description:
                            err.status === 401
                                ? t('common:invalidCredentials')
                                : t('common:serverError'),
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    });
                });
        },
    });
};
