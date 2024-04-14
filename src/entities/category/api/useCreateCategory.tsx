import api from '@/shared/lib/api';
import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { CategoryType } from '../model/types';

export const useCreateCategory = (onSuccess: () => void) => {
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const toast = useToast();

    return useMutation({
        mutationFn: (data: {
            name: string;
            default: boolean;
            parentId?: string;
            categoryType: CategoryType;
        }) => {
            return api.post('finance/category', { json: data });
        },
        onSuccess: () => {
            toast({
                title: t('common:success'),
                description: t('finance:categories.categoryCreated'),
                status: 'success',
                duration: 1000,
                isClosable: true,
            });

            onSuccess();
            return queryClient.invalidateQueries(['categories']);
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
