import { Button, Checkbox, HStack, Heading, Link, Stack, Text, useToast } from '@chakra-ui/react';
import { useTitle } from '@shared/hooks';
import { Back } from '@shared/ui/Back';
import { FieldsConfig, FormField, validationRules } from '@shared/ui/Form';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';

import { Fields, useLogin } from '../api/useLogin';
import { AuthContainer } from './AuthContainer';

export const Login = () => {
    const toast = useToast();
    const { t } = useTranslation();
    const location = useLocation();

    useTitle(t('profile:login'));

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

    const { mutate: onSubmit } = useLogin(setError);

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
        <AuthContainer>
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
            <Stack spacing={4} as='form' onSubmit={handleSubmit((data) => onSubmit(data), onError)}>
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
                        <NavLink
                            to={{
                                pathname: '/auth',
                                search: location.search,
                            }}
                        >
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
        </AuthContainer>
    );
};
