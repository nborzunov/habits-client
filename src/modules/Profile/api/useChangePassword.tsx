import { useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '~/common/helpers/api';
import processError from '~/common/helpers/processError';
import { SetError } from '~/common/types';

export interface FormData {
    currentPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
}

export type Fields = keyof FormData;

export const useChangePassword = (setError: SetError<Fields>) => {
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
                    processError<Fields>(
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
