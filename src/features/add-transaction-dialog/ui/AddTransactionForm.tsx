import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    HStack,
    Icon,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    ModalBody,
    Stack,
    Tooltip,
} from '@chakra-ui/react';
import { Account } from '@entities/account';
import { Category, CategoryType, useCategoriesByType } from '@entities/category';
import { getAccountTypeColor, getCurrency, getModeButtonColor } from '@entities/finance';
import { TransactionType, useCreateTransaction } from '@entities/transaction';
import { useAccountManagementDialog } from '@features/account-management-dialog';
import { useAddAccountDialog } from '@features/add-account-dialog';
import { useAddCategoryDialog } from '@features/add-category-dialog';
import { openCategoryManagementDialog } from '@features/category-management-dialog';
import { Icons$ } from '@shared/lib';
import { validationRules } from '@shared/ui/Form';
import { FormField, SelectFromPicklist } from '@shared/ui/Form';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { AddTransactionMode } from '../model/types';
import { useAddTransactionDialog } from './AddTransactionDialog';

export const AddTransactionForm = ({
    accounts,
    mode,
    setMode,
}: {
    accounts: Account[];
    mode: AddTransactionMode;
    setMode: React.Dispatch<React.SetStateAction<AddTransactionMode>>;
}) => {
    const { t } = useTranslation();
    const dialog = useAddTransactionDialog();
    const defaultState: {
        date: string;
        account: Account | undefined;
        category: Category | undefined;
        amount: number | '';
        note: string;
    } = useMemo(
        () => ({
            date: dayjs().format('YYYY-MM-DD'),
            account: undefined,
            category: undefined,
            amount: '',
            note: '',
        }),
        [],
    );
    const {
        register,
        formState: { errors, isSubmitting },
        handleSubmit,
        setValue,
        watch,
    } = useForm({
        mode: 'all',
        defaultValues: defaultState,
    });

    const { mutate } = useCreateTransaction(() => {
        handleClose();
    });

    const onFormSubmit = (data: {
        date: string;
        account: Account | undefined;
        category: Category | undefined;
        amount: number | '';
        note: string;
    }) => {
        const currentTime = dayjs();
        const date = dayjs(data.date)
            .add(currentTime.hour(), 'hour')
            .add(currentTime.minute(), 'minute')
            .add(currentTime.second(), 'second');

        mutate({
            date: date.toDate(),
            accountId: data.account?.id as string,
            categoryId: data.category?.id as string,
            transactionType: mode as unknown as TransactionType,
            amount: Number(data.amount) || 0,
            note: data.note,
        });
    };

    const [form, setForm] = useState(defaultState);

    const categories = useCategoriesByType(mode as unknown as CategoryType);

    const addAccountDialog = useAddAccountDialog();

    const accountManagementDialog = useAccountManagementDialog();

    const addCategoryDialog = useAddCategoryDialog();

    const openAddAccountDialog = useCallback(
        () =>
            addAccountDialog.show({
                breadcrumbs: [
                    {
                        label: t('finance:addTransaction'),
                        onClick: addAccountDialog.hide,
                    },
                    {
                        label: t(`finance:newAccount`),
                    },
                ],
            }),
        [t, addAccountDialog],
    );

    const openAddCategoryDialog = useCallback(
        () =>
            addCategoryDialog.show({
                breadcrumbs: [
                    {
                        label: t('finance:addTransaction'),
                        onClick: addCategoryDialog.hide,
                    },
                    {
                        label: t(`finance:categories.newCategory`),
                    },
                ],

                categoryType: mode as unknown as CategoryType,
            }),
        [t, addCategoryDialog, mode],
    );

    const clearForm = useCallback(() => {
        setValue('account', undefined);
        setValue('category', undefined);
        setValue('amount', '');
        setValue('note', '');
        setForm(defaultState);
        setMode(AddTransactionMode.Expense);
    }, [setValue, setMode, defaultState]);

    const handleClose = useCallback(() => {
        clearForm();
        dialog.hide();
    }, [clearForm, dialog]);

    useEffect(() => {
        const subscription = watch((value) => setForm(value as any));
        return () => subscription.unsubscribe();
    }, [watch]);

    useEffect(() => {
        setValue('category', undefined);
        setForm((f) => ({ ...f, category: undefined }));
    }, [mode, setValue]);

    return (
        <>
            <ModalBody py={0} as={'form'} onSubmit={handleSubmit(onFormSubmit)}>
                <HStack spacing={2}>
                    {Object.values(AddTransactionMode).map((m) => (
                        <Button
                            key={m}
                            variant={mode === m ? 'outline' : 'solid'}
                            colorScheme={mode === m ? getModeButtonColor(m) : 'gray'}
                            onClick={() => setMode(m)}
                            w={'33%'}
                        >
                            {t(`finance:transactionTypes.${m}`)}
                        </Button>
                    ))}
                </HStack>

                <Stack>
                    <FormField
                        label={t('finance:date')}
                        validationProps={register('date', validationRules.text(2))}
                        validationError={errors.date}
                        field={'date'}
                        direction={'column'}
                        variant={'outline'}
                        type={'date'}
                        isRequired
                    />

                    <SelectFromPicklist
                        name={t('finance:account')}
                        title={t('finance:selectAccount')}
                        value={form.account}
                        onChange={(value) => setValue('account', value)}
                        items={accounts.map((account) => ({
                            id: account.id,
                            label: account.name,
                            value: account,
                        }))}
                        noItemsWarning={
                            <>
                                <Alert status='info'>
                                    <AlertIcon />
                                    {t('finance:noAccountsWarning')}
                                </Alert>

                                <Button
                                    mt={2}
                                    width={'100%'}
                                    colorScheme='green'
                                    variant={'outline'}
                                    type='submit'
                                    size={{
                                        base: 'md',
                                        sm: 'md',
                                    }}
                                    onClick={openAddAccountDialog}
                                >
                                    {t('finance:newAccount')}
                                </Button>
                            </>
                        }
                        editButton={
                            <Tooltip label={t('finance:manageAccounts')}>
                                <IconButton
                                    icon={<Icon as={Icons$.Settings} />}
                                    aria-label={'manage accounts'}
                                    size={'xs'}
                                    variant={'ghost'}
                                    onClick={() => accountManagementDialog.show({})}
                                ></IconButton>
                            </Tooltip>
                        }
                        addItem={openAddAccountDialog}
                    >
                        {(account) => (
                            <Flex width='100%' alignItems='center'>
                                <Icon
                                    as={
                                        Icons$.accountTypes[
                                            account.accountType as keyof typeof Icons$.accountTypes
                                        ]
                                    }
                                    fontSize={'4xl'}
                                    color={`${getAccountTypeColor(account)}.500`}
                                    p={2}
                                    borderRadius={'xl'}
                                    boxShadow={'sm'}
                                />
                                <span>{account.name}</span>
                            </Flex>
                        )}
                    </SelectFromPicklist>
                    <SelectFromPicklist
                        name={t('finance:category')}
                        title={t('finance:selectCategory')}
                        value={form.category}
                        onChange={(value) => setValue('category', value)}
                        items={categories}
                        editButton={
                            <Tooltip label={t('finance:categories.manageCategories')}>
                                <IconButton
                                    icon={<Icon as={Icons$.Settings} />}
                                    aria-label={'manage categories'}
                                    size={'xs'}
                                    variant={'ghost'}
                                    onClick={() =>
                                        openCategoryManagementDialog({
                                            mode: mode as unknown as CategoryType,
                                        })
                                    }
                                ></IconButton>
                            </Tooltip>
                        }
                        noItemsWarning={
                            <>
                                <Alert status='info'>
                                    <AlertIcon />
                                    {t('finance:categories.noCategoriesWarning')}
                                </Alert>

                                <Button
                                    mt={2}
                                    width={'100%'}
                                    colorScheme='green'
                                    variant={'outline'}
                                    type='submit'
                                    size={{
                                        base: 'md',
                                        sm: 'md',
                                    }}
                                    onClick={openAddCategoryDialog}
                                >
                                    {t('finance:categories.newCategory')}
                                </Button>
                            </>
                        }
                        addItem={openAddCategoryDialog}
                    >
                        {(category) => (
                            <Flex width='100%' alignItems='center' h='36px'>
                                <Icon
                                    as={
                                        Icons$.expenseIcons[
                                            category.icon as keyof typeof Icons$.expenseIcons
                                        ]
                                    }
                                    fontSize={'4xl'}
                                    color={`${category.color}.500`}
                                    p={2}
                                    borderRadius={'xl'}
                                    boxShadow={'sm'}
                                />
                                <span>{category.name}</span>
                            </Flex>
                        )}
                    </SelectFromPicklist>

                    <FormControl>
                        <FormLabel>{t('finance:amount')}</FormLabel>
                        <InputGroup>
                            <Input
                                type={'number'}
                                value={form.amount as number}
                                placeholder={t('finance:enterAmount') as string}
                                {...register('amount')}
                            />
                            <InputRightElement pointerEvents='none' color='gray.400'>
                                {getCurrency(form.account?.currency || '')}
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>

                    <FormControl>
                        <FormLabel>{t('finance:note')}</FormLabel>

                        <Input
                            type={'text'}
                            value={form.note}
                            placeholder={t('finance:enterNote') as string}
                            onChange={(e) => setValue('note', e.target.value)}
                        />
                    </FormControl>
                </Stack>

                <Box py={4} display={'flex'} justifyContent={'end'}>
                    <Button
                        colorScheme='blue'
                        mr={3}
                        size={{
                            base: 'md',
                            sm: 'md',
                        }}
                        onClick={handleClose}
                    >
                        {t('common:close')}
                    </Button>
                    <Button
                        colorScheme='green'
                        type='submit'
                        size={{
                            base: 'md',
                            sm: 'md',
                        }}
                        isLoading={isSubmitting}
                    >
                        {t('finance:save')}
                    </Button>
                </Box>
            </ModalBody>
        </>
    );
};
