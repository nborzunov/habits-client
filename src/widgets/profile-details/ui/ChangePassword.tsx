import { Box, Button, Heading, Stack, useToast } from '@chakra-ui/react';
import { activeUserState } from '@entities/auth';
import { ChangePasswordFields, useChangePassword } from '@entities/profile';
import { useMobile, useTitle } from '@shared/hooks';
import { FormField } from '@shared/ui/Form';
import { FieldsConfig } from '@shared/ui/Form/types';
import { validationRules } from '@shared/ui/Form/validationRules';
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';

export const ChangePassword = () => {
    const user = useRecoilValue(activeUserState);
    const toast = useToast();
    const { t } = useTranslation();

    useTitle(`${user?.name} ${user?.surname} - ${t('common:changePassword')}`);

    const initialState = {
        currentPassword: '',
        newPassword: '',
        newPasswordConfirm: '',
    };
    const {
        register,
        watch,
        formState: { errors, isSubmitting },
        handleSubmit,
        setError,
    } = useForm({
        mode: 'all',
        defaultValues: initialState,
    });

    const { mutate: changePassword } = useChangePassword(setError);

    const onFormError = () => {
        toast({
            title: t('common:error'),
            description: t('common:invalidForm'),
            status: 'error',
            isClosable: true,
        });
    };

    useEffect(() => {
        const subscription = watch(({ currentPassword, newPassword, newPasswordConfirm }) => {
            if (newPasswordConfirm !== newPassword) {
                setError('newPasswordConfirm', {
                    type: 'custom',
                    message: 'profile:password.errors.notMatch',
                });
            }

            if (currentPassword == newPassword) {
                setTimeout(() => {
                    setError('newPassword', {
                        type: 'custom',
                        message: 'profile:password.errors.similar',
                    });
                });
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, setError]);

    const isMobile = useMobile();

    const fieldsConfig: FieldsConfig<ChangePasswordFields> = useMemo(
        () => [
            {
                field: 'currentPassword',
                label: !isMobile
                    ? t('profile:password.currentPassword.long')
                    : t('profile:password.currentPassword.short'),
                validationProps: register('currentPassword', validationRules.password()),
            },
            {
                field: 'newPassword',
                label: !isMobile
                    ? t('profile:password.newPassword.long')
                    : t('profile:password.newPassword.short'),
                validationProps: register('newPassword', validationRules.newPassword()),
            },
            {
                field: 'newPasswordConfirm',
                label: !isMobile
                    ? t('profile:password.repeatPassword.long')
                    : t('profile:password.repeatPassword.short'),
                validationProps: register(
                    'newPasswordConfirm',
                    validationRules.newPasswordConfirm(),
                ),
            },
        ],
        [register, isMobile, t],
    );

    return (
        <Box as={'form'} onSubmit={handleSubmit((data) => changePassword(data), onFormError)}>
            <Heading as='h3' size='md' mb={'6'}>
                {t('common:changePassword')}
            </Heading>
            <Stack spacing={4}>
                {fieldsConfig.map(({ field, label, validationProps }) => (
                    <FormField
                        isRequired
                        minWidth={{
                            md: '240px',
                            sm: '100px',
                        }}
                        key={field}
                        field={field}
                        label={label}
                        validationError={errors[field]}
                        validationProps={validationProps}
                        hideResetButton
                        showPasswordIcon={true}
                    />
                ))}

                <Stack spacing={10} pt={4}>
                    <Button
                        loadingText={t('common:formSubmitting') as string}
                        size='md'
                        colorScheme={'purple'}
                        width={'160px'}
                        type='submit'
                        isLoading={isSubmitting}
                    >
                        {t('common:saveChanges')}
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
};
