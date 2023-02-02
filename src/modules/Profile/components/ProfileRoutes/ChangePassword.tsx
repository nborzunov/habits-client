import { Box, Button, Heading, Stack, useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';
import api from '~/common/helpers/api';
import processError from '~/common/helpers/processError';
import validationRules from '~/common/helpers/validationRules';
import useMobile from '~/common/hooks/useMobile';
import useTitle from '~/common/hooks/useTitle';
import { activeUserState } from '~/common/store/atoms';
import FormField, { FieldsConfig } from '~/ui/FormField';

interface FormData {
    currentPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
}

type Fields = keyof FormData;

export const ChangePassword = () => {
    const user = useRecoilValue(activeUserState);
    useTitle(`${user?.name} ${user?.surname} - Change Password`);

    const toast = useToast();

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

    const changePassword = useMutation({
        mutationFn: (data: { currentPassword: string; newPassword: string }) => {
            return api
                .post('users/me/change-password', { json: data })
                .json()
                .then(() =>
                    toast({
                        title: 'Success',
                        description: 'Profile updated!',
                        status: 'success',
                        duration: 1000,
                        isClosable: true,
                    }),
                )
                .catch((error) => {
                    processError<Fields>(
                        error,
                        (errorMessage) => {
                            toast({
                                title: 'Error',
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

    const onSubmit = (data: FormData) => {
        changePassword.mutate({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
        });
    };

    const onError = () => {
        toast({
            title: 'Error',
            description: 'Please check all fields',
            status: 'error',
            isClosable: true,
        });
    };

    useEffect(() => {
        const subscription = watch(({ currentPassword, newPassword, newPasswordConfirm }) => {
            if (newPasswordConfirm !== newPassword) {
                setError('newPasswordConfirm', {
                    type: 'custom',
                    message: 'Passwords do not match',
                });
            }

            if (currentPassword == newPassword) {
                setTimeout(() => {
                    setError('newPassword', {
                        type: 'custom',
                        message: 'New password must be different from current',
                    });
                });
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, setError]);

    const isMobile = useMobile();

    const fieldsConfig: FieldsConfig<Fields> = useMemo(
        () => [
            {
                field: 'currentPassword',
                label: !isMobile ? 'Current Password' : 'Password',
                validationProps: register('currentPassword', validationRules.password()),
            },
            {
                field: 'newPassword',
                label: !isMobile ? 'New Password' : 'New',
                validationProps: register('newPassword', validationRules.newPassword()),
            },
            {
                field: 'newPasswordConfirm',
                label: !isMobile ? 'Repeat Password' : 'Repeat',
                validationProps: register(
                    'newPasswordConfirm',
                    validationRules.newPasswordConfirm(),
                ),
            },
        ],
        [register, isMobile],
    );

    return (
        <Box as={'form'} onSubmit={handleSubmit(onSubmit, onError)}>
            <Heading as='h3' size='md' mb={'6'}>
                Change Password
            </Heading>
            <Stack spacing={4}>
                {fieldsConfig.map(({ field, label, validationProps }) => (
                    <FormField
                        isRequired
                        minWidth={{
                            base: '200px',
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
                        loadingText='Submitting'
                        size='md'
                        colorScheme={'purple'}
                        width={'160px'}
                        type='submit'
                        isLoading={isSubmitting}
                    >
                        Save changes
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
};
