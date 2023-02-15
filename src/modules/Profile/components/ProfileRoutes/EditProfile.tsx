import { Box, Button, Heading, Stack, useToast } from '@chakra-ui/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import validationRules from '~/common/helpers/validationRules';
import useTitle from '~/common/hooks/useTitle';
import { activeUserState } from '~/common/store/atoms';
import { EditProFileData, useEditProfile } from '~/modules/Profile/api/useEditProfile';
import FormField, { FieldsConfig } from '~/ui/FormField';

interface Props {
    initialState: EditProFileData;
}

export const EditProfile = ({ initialState }: Props) => {
    const user = useRecoilValue(activeUserState);
    const toast = useToast();
    const { t } = useTranslation();

    useTitle(`${user?.name} ${user?.surname} - ${t('common:edit')}`);

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

    const { mutate: editProfile } = useEditProfile();

    const onFormError = () => {
        toast({
            title: t('common:error'),
            description: t('common:invalidForm'),
            status: 'error',
            isClosable: true,
        });
    };

    const fieldsConfig: FieldsConfig<'name' | 'surname' | 'username' | 'bio'> = [
        {
            field: 'name',
            label: t('profile:name'),
            validationProps: register('name', validationRules.text(3)),
        },
        {
            field: 'surname',
            label: t('profile:surname'),
            validationProps: register('surname', validationRules.text(3)),
        },
        {
            field: 'username',
            label: t('profile:username.field'),
            validationProps: register('username', validationRules.text(6)),
        },
        {
            field: 'bio',
            label: t('profile:bio.long'),
            validationProps: register('bio', validationRules.longText()),
        },
        //     TODO: avatar image
    ];

    return (
        <Box as={'form'} onSubmit={handleSubmit((data) => editProfile(data), onFormError)}>
            <Heading as='h3' size='md' mb={'6'}>
                {t('common:editProfile')}
            </Heading>
            <Stack spacing={4}>
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
