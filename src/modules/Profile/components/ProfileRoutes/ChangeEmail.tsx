import {
    Badge,
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Stack,
    Tooltip,
    useToast,
} from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import validationRules from '~/common/helpers/validationRules';
import useMobile from '~/common/hooks/useMobile';
import useTitle from '~/common/hooks/useTitle';
import { activeUserState } from '~/common/store/atoms';
import { User } from '~/modules/Profile/types';
import FormField, { FieldsConfig } from '~/ui/FormField';

type ChangeEmailData = Required<Pick<User, 'email'>>;

interface Props {
    initialState: ChangeEmailData;
}

export const ChangeEmail = ({ initialState }: Props) => {
    const user = useRecoilValue(activeUserState);

    const toast = useToast();
    const { t } = useTranslation();

    useTitle(`${user?.name} ${user?.surname} - ${t('common:changeEmail')}`);

    const {
        register,
        watch,
        formState: { errors, isSubmitting },
        handleSubmit,
        setValue,
    } = useForm({
        mode: 'all',
        defaultValues: initialState,
    });

    const onSubmit = (_data: any) => {
        alert('TODO');
    };

    const onError = () => {
        toast({
            title: t('common:error'),
            description: t('common:invalidForm'),
            status: 'error',
            isClosable: true,
        });
    };

    const isMobile = useMobile();
    const fieldsConfig: FieldsConfig<'email'> = [
        {
            field: 'email',
            label: !isMobile ? t('profile:email.long') : t('profile:email.short'),
            validationProps: register('email', validationRules.email()),
        },
    ];

    const verifyEmail = () => {
        alert('TODO');
    };

    if (!user) {
        return null;
    }
    return (
        <Box as={'form'} onSubmit={handleSubmit(onSubmit, onError)}>
            <Heading as='h3' size='md' mb={'6'}>
                {t('common:changeEmail')}
            </Heading>
            <Stack spacing={4}>
                <Flex justifyContent={'space-between'}>
                    <Flex alignItems={'center'} justifyContent={'space-between'} width={'100%'}>
                        <FormControl width={'100%'}>
                            <FormLabel
                                lineHeight={'40px'}
                                mr={3}
                                mb={0}
                                width='100%'
                                maxWidth={{
                                    lg: '200px',
                                    md: '200px',
                                    sm: '200px',
                                }}
                            >
                                {t('profile:email.status')}
                            </FormLabel>
                        </FormControl>

                        {user.emailVerified ? (
                            <Badge
                                colorScheme='green'
                                fontSize={'sm'}
                                py={'2'}
                                px={'4'}
                                borderRadius={'12'}
                                width={'50%'}
                            >
                                {t('profile:email.verified')}
                            </Badge>
                        ) : (
                            <Tooltip label={t('profile:email.verifyAction')}>
                                <Badge
                                    colorScheme='red'
                                    fontSize={'sm'}
                                    py={'2'}
                                    px={'4'}
                                    borderRadius={'12'}
                                    transition={'all 0.5s ease'}
                                    _hover={{ cursor: 'pointer', opacity: 0.8 }}
                                    onClick={verifyEmail}
                                    width={'50%'}
                                >
                                    {t('profile:email.verify')}
                                </Badge>
                            </Tooltip>
                        )}
                    </Flex>
                </Flex>
                {fieldsConfig.map(({ field, label, validationProps }) => (
                    <FormField
                        key={field}
                        field={field}
                        label={label}
                        value={watch(field)}
                        initialValue={initialState[field]}
                        resetValue={() =>
                            setValue(field, initialState[field], {
                                shouldValidate: true,
                                shouldTouch: true,
                            })
                        }
                        validationError={errors[field]}
                        validationProps={validationProps}
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
