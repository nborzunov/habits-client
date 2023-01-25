import React, { useEffect } from 'react';
import { Box, Button, Heading, Stack, useToast } from '@chakra-ui/react';
import FormField, { FieldsConfig } from '~/common/components/FormField';
import { useForm } from 'react-hook-form';
import validationRules from '~/common/helpers/validationRules';
import { useMutation } from '@tanstack/react-query';
import api from '~/common/helpers/api';
import useTitle from '~/common/hooks/useTitle';
import processError from '~/common/helpers/processError';

interface FormData {
    currentPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
}

type Fields = keyof FormData;

const ChangePassword = ({ title }: { title: string }) => {
    useTitle(title);

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
                .post('/users/me/change-password', data)
                .then((res) => res.data)
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

    const fieldsConfig: FieldsConfig<Fields> = [
        {
            field: 'currentPassword',
            label: 'Current Password',
            validationProps: register('currentPassword', validationRules.password()),
        },
        {
            field: 'newPassword',
            label: 'New Password',
            validationProps: register('newPassword', validationRules.newPassword()),
        },
        {
            field: 'newPasswordConfirm',
            label: 'Repeat Password',
            validationProps: register('newPasswordConfirm', validationRules.newPasswordConfirm()),
        },
    ];

    return (
        <Box as={'form'} onSubmit={handleSubmit(onSubmit, onError)}>
            <Heading as='h3' size='md' mb={'6'}>
                Change Password
            </Heading>
            <Stack spacing={4}>
                {fieldsConfig.map(({ field, label, validationProps }) => (
                    <FormField
                        isRequired
                        minWidth={'200px'}
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

export default ChangePassword;
