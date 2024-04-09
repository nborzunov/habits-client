import api from '@/shared/lib/api';
import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { TransactionType } from '../../../pages/finance/model/types';

export const useCreateTransaction = (onSuccess: () => void) => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const toast = useToast();

    return useMutation({
        mutationFn: (data: {
            date: Date;
            accountId: string;
            categoryId: string;
            transactionType: TransactionType;
            amount: number;
            note: string;
        }) => {
            return api.post('finance/transaction', { json: data });
        },
        onSuccess: () => {
            toast({
                title: t('common:success'),
                description: t('finance:transactionCreated'),
                status: 'success',
                duration: 1000,
                isClosable: true,
            });

            onSuccess();
            return queryClient.invalidateQueries(['transactions']);
        },
        // TODO: fix any
        onError: (err: any) => {
            toast({
                title: t('common:error'),
                description:
                    err.status === 401 ? t('common:invalidCredentials') : t('common:serverError'),
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        },
    });
};
