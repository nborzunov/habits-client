import { Button, HStack, Heading, Link, Stack, Text, useToast } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { useForm } from 'react-hook-form';
import { NavLink } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import api from '~/common/helpers/api';
import processError from '~/common/helpers/processError';
import validationRules from '~/common/helpers/validationRules';
import useTitle from '~/common/hooks/useTitle';
import { tokenState } from '~/common/store/atoms';
import { ProfileData } from '~/modules/Profile/types';
import FormField, { FieldsConfig } from '~/ui/FormField';
import Back from '~/ui/Layout/components/Back';

type Fields = 'name' | 'surname' | 'username' | 'email' | 'password';

export const Signup = ({ refetch }: { refetch: () => void }) => {
    useTitle('Sign Up');
    const setToken = useSetRecoilState(tokenState);

    const toast = useToast();
    const signup = useMutation({
        mutationFn: (data: ProfileData) => {
            return api
                .post<{
                    token: string;
                }>('/users/signup', data)
                .then((res) => res.data)
                .then((data) => setToken(`Bearer ${data.token}`))
                .then(() => refetch())
                .then(() =>
                    toast({
                        title: 'Success',
                        description: 'Successfully login!',
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

    const onSubmit = (data: ProfileData) => {
        signup.mutate(data);
    };

    const onError = () => {
        toast({
            title: 'Error',
            description: 'Please check all fields',
            status: 'error',
            isClosable: true,
        });
    };

    const nameFieldsConfig: FieldsConfig<'name' | 'surname'> = [
        {
            field: 'name',
            label: 'Name',
            validationProps: register('name', validationRules.text(3)),
        },
        {
            field: 'surname',
            label: 'Surname',
            validationProps: register('surname', validationRules.text(3)),
        },
    ];
    const otherFieldsConfig: FieldsConfig<'username' | 'email' | 'password'> = [
        {
            field: 'username',
            label: 'Username',
            validationProps: register('username', validationRules.text(6)),
        },
        {
            field: 'email',
            label: 'Email Address',
            validationProps: register('email', validationRules.email()),
        },
        {
            field: 'password',
            label: 'Password',
            validationProps: register('password', validationRules.newPassword()),
        },
    ];

    return (
        <>
            <Stack align={'center'} pb={8}>
                <Heading fontSize={'4xl'} textAlign={'center'}>
                    Sign up
                </Heading>
                <Text fontSize={'lg'} color={'gray.600'}>
                    to enjoy all of our cool features ✌️
                </Text>
            </Stack>

            <Stack spacing={4} as={'form'} onSubmit={handleSubmit(onSubmit, onError)}>
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
                        <NavLink to={'/'}>
                            <Back size={'lg'} />
                        </NavLink>

                        <Button
                            loadingText='Submitting'
                            size='lg'
                            colorScheme={'purple'}
                            width={'100%'}
                            type={'submit'}
                            isLoading={isSubmitting}
                        >
                            Sign up
                        </Button>
                    </HStack>
                </Stack>
                <Stack pt={1}>
                    <Text align={'center'}>
                        Already a user?{' '}
                        <Link as={NavLink} to='/login' color={'blue.400'}>
                            Login
                        </Link>
                    </Text>
                </Stack>
            </Stack>
        </>
    );
};
