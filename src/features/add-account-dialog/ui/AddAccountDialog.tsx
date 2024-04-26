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
import { useCreateAccount } from '@entities/account';
import { AccountType } from '@entities/account';
import { Currency, getCurrency } from '@entities/finance';
import { createDialog, openDialog, useDialog } from '@shared/hooks';
import { Breadcrumbs, BreadcrumbsProps } from '@shared/ui/Breadcrumbs';
import { SelectFromPicklist } from '@shared/ui/Form';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface FormData {
    name: string;
    account_type: AccountType | '';
    currency:
        | {
              id: Currency;
              name: Currency;
          }
        | '';
    amount?: number | '';
}

type Props = {} & BreadcrumbsProps;

export const AddAccountDialog = createDialog(({ breadcrumbs }: Props) => {
    const dialog = useAddAccountDialog();
    const { t } = useTranslation();

    const { mutate } = useCreateAccount(() => {
        dialog.hide();
    });

    const defaultState: FormData = {
        name: '',
        account_type: '',
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
            account_type: data.account_type as AccountType,
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

    return (
        <Modal isOpen={dialog.visible} onClose={dialog.hide} closeOnOverlayClick={false}>
            <ModalContent mx={4} as={'form'} onSubmit={handleSubmit(onFormSubmit)}>
                <ModalHeader>
                    <Breadcrumbs items={breadcrumbs} />
                </ModalHeader>
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
                            <FormLabel>{t('finance:account_type')}</FormLabel>
                            <InputGroup>
                                <HStack spacing={2}>
                                    {Object.values(AccountType).map((account_type) => (
                                        <Button
                                            key={account_type}
                                            variant={
                                                form.account_type === account_type
                                                    ? 'outline'
                                                    : 'solid'
                                            }
                                            colorScheme={
                                                form.account_type === account_type
                                                    ? getAccountTypeButtonColor(account_type)
                                                    : 'gray'
                                            }
                                            onClick={() => setValue('account_type', account_type)}
                                            w={'33%'}
                                        >
                                            {t(`finance:account_types.${account_type}`)}
                                        </Button>
                                    ))}
                                </HStack>
                            </InputGroup>
                        </FormControl>
                        <SelectFromPicklist
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
                        >
                            {(currency) => currency.name}
                        </SelectFromPicklist>

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
                                    {getCurrency(form.currency ? form.currency.id : '')}
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                    </Stack>
                </ModalBody>

                <ModalFooter>
                    <Box display={'flex'} justifyContent={'end'}>
                        <Button colorScheme='blue' mr={3} size={'md'} onClick={dialog.hide}>
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
});

export const openAddAccountDialog = (props: Props) =>
    openDialog(AddAccountDialog, {
        id: 'AddAccount',
        ...props,
    });

export const useAddAccountDialog = () => useDialog(AddAccountDialog);
