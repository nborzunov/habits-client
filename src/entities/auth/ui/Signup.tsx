import { Button, HStack, Heading, Link, Stack, Text, useToast } from '@chakra-ui/react';
import { useTitle } from '@shared/hooks';
import { Back } from '@shared/ui/Back';
import { FieldsConfig, FormField, validationRules } from '@shared/ui/Form';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';

import { useSignup } from '../api/useSignup';
import { AuthContainer } from './AuthContainer';

export const Signup = () => {
    const toast = useToast();
    const { t } = useTranslation();
    const location = useLocation();

    useTitle(t('common:signup.base'));

    const {
        register,
        watch,
        formState: { errors, isSubmitting },
        handleSubmit,
        setError,
    } = useForm({
        mode: 'all',
        defaultValues: {
            name: '',
            surname: '',
            username: '',
            email: '',
            password: '',
        },
    });

    const { mutate: onSubmit } = useSignup(setError);

    const onError = () => {
        toast({
            title: t('common:error'),
            description: t('common:invalidForm'),
            status: 'error',
            isClosable: true,
        });
    };

    const nameFieldsConfig: FieldsConfig<'name' | 'surname'> = [
        {
            field: 'name',
            label: t('profile:name'),
            validationProps: register(
                'name',
                validationRules.text({
                    minLength: 3,
                }),
            ),
        },
        {
            field: 'surname',
            label: t('profile:surname'),
            validationProps: register(
                'surname',
                validationRules.text({
                    minLength: 3,
                }),
            ),
        },
    ];
    const otherFieldsConfig: FieldsConfig<'username' | 'email' | 'password'> = [
        {
            field: 'username',
            label: t('profile:username.field'),
            validationProps: register(
                'username',
                validationRules.text({
                    minLength: 6,
                }),
            ),
        },
        {
            field: 'email',
            label: t('profile:email.long'),
            validationProps: register('email', validationRules.email()),
        },
        {
            field: 'password',
            label: t('profile:password.currentPassword.short'),
            validationProps: register('password', validationRules.newPassword()),
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
                    {t('common:signup.lower')}
                </Heading>
                <Text
                    fontSize={{
                        base: 'lg',
                        sm: 'md',
                    }}
                    textAlign={'center'}
                    color={'gray.600'}
                >
                    {t('profile:signupDescription')}
                </Text>
            </Stack>

            <Stack
                spacing={4}
                as={'form'}
                onSubmit={handleSubmit((data) => onSubmit(data), onError)}
            >
                <HStack spacing={4}>
                    {nameFieldsConfig.map(({ field, label, validationProps }) => (
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
                        />
                    ))}
                </HStack>
                {otherFieldsConfig.map(({ field, label, validationProps }) => (
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

                <Stack spacing={10} pt={4}>
                    <HStack spacing={3}>
                        <NavLink to={{ pathname: '/auth', search: location.search }}>
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
                            {t('common:signup.lower')}
                        </Button>
                    </HStack>
                </Stack>
                <Stack pt={1}>
                    <Text align={'center'}>
                        <Text pr={1} as={'span'}>
                            {t('profile:alreadyHaveAccount')}
                        </Text>
                        <Link as={NavLink} to='/login' color={'blue.400'}>
                            {t('common:login')}
                        </Link>
                    </Text>
                </Stack>
            </Stack>
        </AuthContainer>
    );
};
