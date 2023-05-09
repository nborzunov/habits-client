import {
    Box,
    Button,
    FormControl,
    FormLabel,
    HStack,
    Input,
    InputGroup,
    InputRightElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Stack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useCreateAccount } from '~/modules/Finance/api/useCreateAccount';
import { SelectFromPicklistField } from '~/modules/Finance/components/SelectFromPicklistField';
import { AccountType, Currency } from '~/modules/Finance/types';

interface FormData {
    name: string;
    accountType: AccountType | '';
    currency:
        | {
              id: Currency;
              name: Currency;
          }
        | '';
    amount?: number | '';
}

export const AddAccountDialog = ({
    isOpen,
    onClose,
    header,
}: {
    isOpen: boolean;
    onClose: () => void;
    header: any;
}) => {
    const { t } = useTranslation();

    const { mutate } = useCreateAccount(() => {
        onClose();
    });

    const defaultState: FormData = {
        name: '',
        accountType: '',
        currency: '',
        amount: '',
    };
    const {
        register,
        formState: { isSubmitting },
        handleSubmit,
        watch,
        setValue,
    } = useForm({
        mode: 'all',
        defaultValues: defaultState,
    });

    const onFormSubmit = (data: FormData) => {
        mutate({
            name: data.name,
            currency: (data.currency && data.currency.id) as Currency,
            accountType: data.accountType as AccountType,
            amount: Number(data.amount) || 0,
        });
    };

    const [form, setForm] = useState(defaultState);

    useEffect(() => {
        const subscription = watch((value) => setForm(value as any));
        return () => subscription.unsubscribe();
    }, [watch]);

    const getAccountTypeButtonColor = (type: AccountType) => {
        switch (type) {
            case AccountType.Cash:
                return 'green';
            case AccountType.Card:
                return 'red';
            case AccountType.Deposit:
                return 'blue';
            case AccountType.Loan:
                return 'yellow';
        }
    };

    const getCurrency = () => {
        if (form.currency) {
            switch (form.currency.id) {
                case Currency.USD:
                    return '$';
                case Currency.EUR:
                    return '€';
                case Currency.RUB:
                    return '₽';
                case Currency.AMD:
                    return '֏';
            }
        }
        return '';
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
            <ModalContent mx={4} as={'form'} onSubmit={handleSubmit(onFormSubmit)}>
                <ModalHeader>{header}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Stack spacing={3}>
                        <FormControl isRequired>
                            <FormLabel>{t('finance:name')}</FormLabel>

                            <Input
                                type={'text'}
                                value={form.name}
                                placeholder={t('finance:name') as string}
                                {...register('name')}
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>{t('finance:accountType')}</FormLabel>
                            <InputGroup>
                                <HStack spacing={2}>
                                    {Object.values(AccountType).map((accountType) => (
                                        <Button
                                            key={accountType}
                                            variant={
                                                form.accountType === accountType
                                                    ? 'outline'
                                                    : 'solid'
                                            }
                                            colorScheme={
                                                form.accountType === accountType
                                                    ? getAccountTypeButtonColor(accountType)
                                                    : 'gray'
                                            }
                                            onClick={() => setValue('accountType', accountType)}
                                            w={'33%'}
                                        >
                                            {t(`finance:accountTypes.${accountType}`)}
                                        </Button>
                                    ))}
                                </HStack>
                            </InputGroup>
                        </FormControl>
                        <SelectFromPicklistField
                            value={form.currency as any}
                            name={t('finance:currency')}
                            onChange={(value) => setValue('currency', value)}
                            title={t('finance:selectCurrency')}
                            items={Object.values(Currency).map((currency) => ({
                                id: currency,
                                label: currency,
                                value: {
                                    id: currency,
                                    name: currency,
                                },
                            }))}
                        />

                        <FormControl isDisabled={!form.currency}>
                            <FormLabel>{t('finance:amount')}</FormLabel>
                            <InputGroup>
                                <Input
                                    type={'number'}
                                    value={form.amount as number}
                                    placeholder={t('finance:enterAmount') as string}
                                    {...register('amount')}
                                />
                                <InputRightElement pointerEvents='none' color='gray.400'>
                                    {getCurrency()}
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                    </Stack>
                </ModalBody>

                <ModalFooter>
                    <Box display={'flex'} justifyContent={'end'}>
                        <Button colorScheme='blue' mr={3} size={'md'} onClick={onClose}>
                            {t('common:close')}
                        </Button>
                        <Button
                            colorScheme='green'
                            type='submit'
                            size={'md'}
                            isLoading={isSubmitting}
                        >
                            {t('finance:create')}
                        </Button>
                    </Box>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
