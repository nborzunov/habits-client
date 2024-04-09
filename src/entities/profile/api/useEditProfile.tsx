import api from '@/shared/lib/api';
import { User } from '@app/types';
import { useToast } from '@chakra-ui/react';
import { activeUserState } from '@entities/auth';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useSetRecoilState } from 'recoil';

import { EditProfileFields } from '../model/types';

export type EditProFileData = Required<Pick<User, EditProfileFields>>;

export const useEditProfile = () => {
    const setActiveUser = useSetRecoilState(activeUserState);
    const { t } = useTranslation();
    const toast = useToast();

    return useMutation({
        mutationFn: (formData: EditProFileData) => {
            return api
                .put(`users/me`, { json: formData })
                .json<User>()
                .then((newUserData) => {
                    setActiveUser(newUserData);
                })
                .then(() =>
                    toast({
                        title: t('common:success'),
                        description: t('profile:successfullyUpdated'),
                        status: 'success',
                        duration: 1000,
                        isClosable: true,
                    }),
                )
                .catch((err) =>
                    toast({
                        title: t('common:error'),
                        description:
                            err.status === 401
                                ? t('common:invalidCredentials')
                                : t('common:serverError'),
                        status: 'error',
                        duration: 3000,
                        isClosable: true,
                    }),
                );
        },
    });
};
