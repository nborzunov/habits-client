import { useToast } from '@chakra-ui/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from '~/common/helpers/api';
import processError from '~/common/helpers/processError';
import { SetError } from '~/common/types';
import { ProfileData } from '~/modules/Profile/types';

export type Fields = 'name' | 'surname' | 'username' | 'email' | 'password';

export const useSignup = (setError: SetError<Fields>) => {
    const { t } = useTranslation();
    const client = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (data: ProfileData) => {
            return api
                .post('users/signup', { json: data })
                .json<{
                    token: string;
                }>()
                .then((data) => localStorage.setItem('authToken', data.token))
                .then(() =>
                    client.invalidateQueries({
                        queryKey: ['active_user'],
                    }),
                )
                .then(() =>
                    toast({
                        title: t('common:success'),
                        description: t('profile:successfullyLogin'),
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
