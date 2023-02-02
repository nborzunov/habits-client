import {
    Badge,
    Box,
    Button,
    Flex,
    Heading,
    Stack,
    Text,
    Tooltip,
    useToast,
} from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';
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
    useTitle(`${user?.name} ${user?.surname} - Change Email`);

    const toast = useToast();
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
            title: 'Error',
            description: 'Please check all fields',
            status: 'error',
            isClosable: true,
        });
    };

    const isMobile = useMobile();
    const fieldsConfig: FieldsConfig<'email'> = [
        {
            field: 'email',
            label: !isMobile ? 'Email Address' : 'Email',
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
                Change Email
            </Heading>
            <Stack spacing={4}>
                <Flex justifyContent={'space-between'}>
                    <Flex alignItems={'center'}>
                        <Text lineHeight={'40px'} width={'140px'} fontWeight={'semibold'}>
                            Status:
                        </Text>

                        {user.emailVerified ? (
                            <Badge
                                colorScheme='green'
                                fontSize={'sm'}
                                py={'2'}
                                px={'4'}
                                borderRadius={'12'}
                            >
                                Verified
                            </Badge>
                        ) : (
                            <Tooltip label={'Click to verify email'}>
                                <Badge
                                    colorScheme='red'
                                    fontSize={'sm'}
                                    py={'2'}
                                    px={'4'}
                                    borderRadius={'12'}
                                    transition={'all 0.5s ease'}
                                    _hover={{ cursor: 'pointer', opacity: 0.8 }}
                                    onClick={verifyEmail}
                                >
                                    Verify
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
