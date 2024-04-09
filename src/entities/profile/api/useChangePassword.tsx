import api from '@/shared/lib/api';
import { useToast } from '@chakra-ui/react';
import { processError } from '@shared/lib';
import { SetError } from '@shared/model/types';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

export interface FormData {
    currentPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
}

export type ChangePasswordFields = keyof FormData;

export const useChangePassword = (setError: SetError<ChangePasswordFields>) => {
    const { t } = useTranslation();
    const toast = useToast();

    return useMutation({
        mutationFn: (data: { currentPassword: string; newPassword: string }) => {
            return api
                .post('users/me/change-password', { json: data })
                .json()
                .then(() =>
                    toast({
                        title: t('common:success'),
                        description: t('profile:successfullyUpdated'),
                        status: 'success',
                        duration: 1000,
                        isClosable: true,
                    }),
                )
                .catch((error) => {
                    processError<ChangePasswordFields>(
                        t,
                        error,
                        (errorMessage) => {
                            toast({
                                title: t('common:error'),
                                description: errorMessage,
                                status: 'error',
                                duration: 3000,
                                isClosable: true,
                            });
                        },
                        (field, message) => {
                            setError(field, {
                                type: 'custom',
                                message: message,
                            });
                        },
                    );
                });
        },
    });
};
