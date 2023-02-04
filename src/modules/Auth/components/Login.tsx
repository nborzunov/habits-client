import { Button, Checkbox, HStack, Heading, Link, Stack, Text, useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import api from '~/common/helpers/api';
import processError from '~/common/helpers/processError';
import validationRules from '~/common/helpers/validationRules';
import useTitle from '~/common/hooks/useTitle';
import FormField, { FieldsConfig } from '~/ui/FormField';
import Back from '~/ui/Layout/components/Back';

type Fields = 'username' | 'password';

export const Login = ({ refetch }: { refetch: () => void }) => {
    const toast = useToast();
    const { t } = useTranslation();

    useTitle(t('profile:login'));

    const login = useMutation({
        mutationFn: (data: { username: string; password: string }) => {
            return api
                .post('auth/', { json: data })
                .json<{
                    token: string;
                }>()
                .then((data) => localStorage.setItem('authToken', data.token))
                .then(() => refetch())
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

    const {
        register,
        watch,
        formState: { errors, isSubmitting },
        handleSubmit,
        setError,
    } = useForm({
        mode: 'all',
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const onSubmit = (data: { username: string; password: string }) => {
        login.mutate(data);
    };

    const onError = () => {
        toast({
            title: t('common:error'),
            description: t('common:invalidForm'),
            status: 'error',
            isClosable: true,
        });
    };

    const fieldsConfig: FieldsConfig<Fields> = [
        {
            field: 'username',
            label: t('profile:username.field'),
            validationProps: register('username', validationRules.text(6)),
        },

        {
            field: 'password',
            label: t('profile:password.currentPassword.short'),
            validationProps: register('password', validationRules.password()),
        },
    ];

    return (
        <>
            <Stack align={'center'} pb={8}>
                <Heading
                    fontSize={{
                        base: '3xl',
                        sm: '2xl',
                    }}
                    textAlign={'center'}
                >
                    {t('profile:signInToAccount')}
                </Heading>
                <Text
                    fontSize={{
                        base: 'lg',
                        sm: 'md',
                    }}
                    color={'gray.600'}
                    textAlign={'center'}
                >
                    {t('profile:signinDescription')}
                </Text>
            </Stack>
            <Stack spacing={4} as='form' onSubmit={handleSubmit(onSubmit, onError)}>
                {fieldsConfig.map(({ field, label, validationProps }) => (
                    <FormField
                        key={field}
                        field={field}
                        label={label}
                        value={watch(field)}
                        validationError={errors[field]}
                        validationProps={validationProps}
                        hideResetButton
                        direction={'column'}
                        variant={'outline'}
                        showPasswordIcon={field === 'password'}
                    />
                ))}
                <Stack spacing={10}>
                    <Stack
                        direction={{ base: 'column', sm: 'row' }}
                        align={'start'}
                        justify={'space-between'}
                    >
                        {/*TODO*/}
                        <Checkbox>{t('profile:password.rememberMe')}</Checkbox>
                        <Link color={'blue.400'}>{t('profile:password.forgot')}</Link>
                    </Stack>
                    <HStack spacing={3}>
                        <NavLink to={'/'}>
                            <Back
                                size={{
                                    base: 'lg',
                                    sm: 'md',
                                }}
                            />
                        </NavLink>

                        <Button
                            loadingText={t('common:formSubmitting') as string}
                            size={{
                                base: 'lg',
                                sm: 'md',
                            }}
                            colorScheme={'purple'}
                            width={'100%'}
                            type={'submit'}
                            isLoading={isSubmitting}
                        >
                            {t('common:signin.lower')}
                        </Button>
                    </HStack>
                </Stack>
            </Stack>
        </>
    );
};
