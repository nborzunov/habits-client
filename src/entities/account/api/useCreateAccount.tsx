import api from '@/shared/lib/api';
import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { Account, AccountType, Currency } from '../../../pages/finance/model/types';

export const useCreateAccount = (onSuccess: () => void) => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const toast = useToast();

    return useMutation({
        mutationFn: (data: {
            name: string;
            currency: Currency;
            accountType: AccountType;
            amount: number;
        }) => {
            return api.post('finance/account', { json: data }).json<Account[]>();
        },
        onSuccess: () => {
            toast({
                title: t('common:success'),
                description: t('finance:accountCreated'),
                status: 'success',
                duration: 1000,
                isClosable: true,
            });

            onSuccess();
            return queryClient.invalidateQueries(['accounts']);
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
