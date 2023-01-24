import { Button, Checkbox, Heading, HStack, Link, Stack, Text, useToast } from '@chakra-ui/react';
import React from 'react';
import Back from '~/Layout/components/Back';
import { useMutation } from '@tanstack/react-query';
import api from '~/common/helpers/api';
import { useSetRecoilState } from 'recoil';
import { tokenState } from '~/common/store/atoms';
import useTitle from '~/common/hooks/useTitle';
import { NavLink } from 'react-router-dom';
import validationRules from '~/common/helpers/validationRules';
import FormField, { FieldsConfig } from '~/common/components/FormField';
import { useForm } from 'react-hook-form';
import processError from '~/common/helpers/processError';

type Fields = 'username' | 'password';

const Login = ({ refetch }: { refetch: () => void }) => {
    useTitle('Login');
    const setToken = useSetRecoilState(tokenState);
    const toast = useToast();
    const login = useMutation({
        mutationFn: (data: { username: string; password: string }) => {
            return api
                .post<{
                    token: string;
                }>('/auth/', data)
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
            username: '',
            password: '',
        },
    });

    const onSubmit = (data: { username: string; password: string }) => {
        login.mutate(data);
    };

    const onError = () => {
        toast({
            title: 'Error',
            description: 'Please check all fields',
            status: 'error',
            isClosable: true,
        });
    };

    const fieldsConfig: FieldsConfig<Fields> = [
        {
            field: 'username',
            label: 'Username',
            validationProps: register('username', validationRules.text(6)),
        },

        {
            field: 'password',
            label: 'Password',
            validationProps: register('password', validationRules.password()),
        },
    ];

    return (
        <>
            <Stack align={'center'} pb={8}>
                <Heading fontSize={'4xl'}>Sign in to your account</Heading>
                <Text fontSize={'lg'} color={'gray.600'}>
                    to enjoy all of our cool features ✌️
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
                        <Checkbox>Remember me</Checkbox>
                        <Link color={'blue.400'}>Forgot password?</Link>
                    </Stack>
                    <HStack spacing={3}>
                        <NavLink to={'/'}>
                            <Back />
                        </NavLink>

                        <Button
                            loadingText='Submitting'
                            size='lg'
                            colorScheme={'purple'}
                            width={'100%'}
                            type={'submit'}
                            isLoading={isSubmitting}
                        >
                            Sign in
                        </Button>
                    </HStack>
                </Stack>
            </Stack>
        </>
    );
};

export default Login;
