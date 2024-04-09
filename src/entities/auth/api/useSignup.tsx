import api from '@/shared/lib/api';
import { useToast } from '@chakra-ui/react';
import { ProfileData } from '@entities/profile/model/types';
import { processError } from '@shared/lib';
import { SetError } from '@shared/model/types';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

import { useActiveUser } from './useActiveUser';

export type Fields = 'name' | 'surname' | 'username' | 'email' | 'password';

export const useSignup = (setError: SetError<Fields>) => {
    const { t } = useTranslation();
    const toast = useToast();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { refetch: refetchActiveUser } = useActiveUser();

    return useMutation({
        mutationFn: (data: ProfileData) => {
            return api
                .post('users/signup', { json: data })
                .json<{
                    token: string;
                }>()
                .then((data) => localStorage.setItem('authToken', data.token))
                .then(() => refetchActiveUser())
                .then(() => {
                    toast({
                        title: t('common:success'),
                        description: t('profile:successfullyLogin'),
                        status: 'success',
                        duration: 1000,
                        isClosable: true,
                    });
                    navigate(searchParams.get('from') || '/');
                })
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
