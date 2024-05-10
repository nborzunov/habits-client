import {
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Stack,
} from '@chakra-ui/react';
import { AccountData, CreateAccountData } from '@entities/account';
import { Dialog } from '@shared/hooks';
import { Breadcrumbs, BreadcrumbsProps } from '@shared/ui/Breadcrumbs';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { AccountTypeField, AmountField, CurrencyField, NameField } from './Fields';

export const AccountForm = ({
    dialog,
    initialState,
    actionButtonLabel,
    breadcrumbs,
    onSubmit,
}: {
    actionButtonLabel: string;
    initialState: CreateAccountData;
    dialog: Dialog;
    onSubmit: (data: AccountData) => void;
} & BreadcrumbsProps) => {
    const { t } = useTranslation();

    const {
        register,
        formState: { isSubmitting },
        handleSubmit,
        setValue,
        watch,
    } = useForm({
        mode: 'all',
        defaultValues: initialState,
    });

    const onFormSubmit = (data: CreateAccountData) => {
        if (!data.name || !data.account_type || !data.currency) {
            return;
        }
        onSubmit({
            name: data.name,
            currency: data.currency,
            account_type: data.account_type,
            amount: Number(data.amount) || 0,
        });
    };

    const [form, setForm] = useState(initialState);

    useEffect(() => {
        const subscription = watch((value) => setForm(value as any));
        return () => subscription.unsubscribe();
    }, [watch]);

    useEffect(() => {
        setForm(initialState);
        setValue('name', initialState.name);
        setValue('account_type', initialState.account_type);
        setValue('currency', initialState.currency);
        setValue('amount', initialState.amount);
    }, [initialState, setValue]);
    return (
        <Modal isOpen={dialog.visible} onClose={dialog.hide} closeOnOverlayClick={false}>
            <ModalContent mx={4} as={'form'} onSubmit={handleSubmit(onFormSubmit)}>
                <ModalHeader>
                    <Breadcrumbs items={breadcrumbs} />
                </ModalHeader>

                <ModalCloseButton />

                <ModalBody as={Stack} spacing={3}>
                    <NameField value={form.name} registerProps={register('name')} />
                    <AccountTypeField value={form.account_type} setValue={setValue} />
                    <CurrencyField value={form.currency} setValue={setValue} />
                    <AmountField
                        value={form.amount}
                        currency={form.currency}
                        registerProps={register('amount')}
                    />
                </ModalBody>

                <ModalFooter as={Flex} justify={'end'} columnGap={3}>
                    <Button colorScheme='blue' size={'md'} onClick={dialog.hide}>
                        {t('common:close')}
                    </Button>
                    <Button colorScheme='green' type='submit' size={'md'} isLoading={isSubmitting}>
                        {actionButtonLabel}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
