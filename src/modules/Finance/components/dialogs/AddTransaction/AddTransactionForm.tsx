import {
    Alert,
    AlertIcon,
    Box,
    Button,
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
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Icons from '~/common/helpers/Icons';
import validationRules from '~/common/helpers/validationRules';
import { useCreateTransaction } from '~/modules/Finance/api/transactions/useCreateTransaction';
import { SelectFromPicklistField } from '~/modules/Finance/components/SelectFromPicklistField';
import { useAccountManagementDialog } from '~/modules/Finance/components/dialogs/AccountManagement/AccountManagement';
import { useAddAccountDialog } from '~/modules/Finance/components/dialogs/AccountManagement/AddAccount';
import { AddTransactionMode } from '~/modules/Finance/components/dialogs/AddTransaction/AddTransaction';
import { useAddCategoryDialog } from '~/modules/Finance/components/dialogs/CategoryManagement/AddCategory';
import { useCategoryManagementDialog } from '~/modules/Finance/components/dialogs/CategoryManagement/CategoryManagement';
import { getCurrency } from '~/modules/Finance/helpers';
import {
    Account,
    Category,
    CategoryType,
    PicklistItem,
    TransactionType,
} from '~/modules/Finance/types';
import FormField from '~/ui/FormField';

const transformCategories = (categories: Category[]): PicklistItem<Category>[] => {
    return categories.map((category) => ({
        id: category.id,
        label: category.name,
        value: category,
        children: category.children.map((child) => ({
            id: child.id,
            label: child.name,
            value: child,
        })),
    }));
};

const getModeButtonColor = (mode: AddTransactionMode) => {
    switch (mode) {
        case AddTransactionMode.Income:
            return 'green';
        case AddTransactionMode.Expense:
            return 'red';
        case AddTransactionMode.Transfer:
            return 'blue';
    }
};

export const AddTransactionForm = ({
    incomeCategories,
    expenseCategories,
    accounts,
    mode,
    setMode,
    onClose,
    setOnClose,
}: {
    incomeCategories: Category[];
    expenseCategories: Category[];
    accounts: Account[];
    mode: AddTransactionMode;
    setMode: React.Dispatch<React.SetStateAction<AddTransactionMode>>;
    onClose: () => void;
    setOnClose: (callback: Array<() => void>) => void;
}) => {
    const { t } = useTranslation();
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

    const categories = useMemo(() => {
        if (mode === AddTransactionMode.Income) {
            return transformCategories(incomeCategories);
        } else if (mode === AddTransactionMode.Expense) {
            return transformCategories(expenseCategories);
        }
        return [];
    }, [mode, incomeCategories, expenseCategories]);

    const { onOpen: onOpenAddAccountDialog, onClose: onCloseAddAccountDialog } =
        useAddAccountDialog();
    const { onOpen: onOpenAccountManagementDialog } = useAccountManagementDialog();
    const { onOpen: onOpenCategoryManagementDialog } = useCategoryManagementDialog();
    const { onOpen: onOpenAddCategoryDialog, onClose: onCloseAddCategoryDialog } =
        useAddCategoryDialog();

    const openAddAccountDialog = useCallback(
        () =>
            onOpenAddAccountDialog({
                breadcrumbs: [
                    {
                        label: t('finance:addTransaction'),
                        onClick: onCloseAddAccountDialog,
                    },
                    {
                        label: t(`finance:newAccount`),
                    },
                ],
            }),
        [t, onOpenAddAccountDialog, onCloseAddAccountDialog],
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
        onClose();
    }, [clearForm, onClose]);

    useEffect(() => {
        setOnClose([handleClose]);
    }, [setOnClose, handleClose]);

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

                    <SelectFromPicklistField
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
                                    icon={<Icon as={Icons.Settings} />}
                                    aria-label={'manage accounts'}
                                    size={'xs'}
                                    variant={'ghost'}
                                    onClick={() => onOpenAccountManagementDialog()}
                                ></IconButton>
                            </Tooltip>
                        }
                        addItem={openAddAccountDialog}
                    />
                    <SelectFromPicklistField
                        name={t('finance:category')}
                        title={t('finance:selectCategory')}
                        value={form.category}
                        onChange={(value) => setValue('category', value)}
                        items={categories}
                        hasChildren
                        editButton={
                            <Tooltip label={t('finance:manageCategories')}>
                                <IconButton
                                    icon={<Icon as={Icons.Settings} />}
                                    aria-label={'manage categories'}
                                    size={'xs'}
                                    variant={'ghost'}
                                    onClick={() =>
                                        onOpenCategoryManagementDialog({
                                            items: categories,
                                            mode: mode as unknown as CategoryType,
                                        })
                                    }
                                ></IconButton>
                            </Tooltip>
                        }
                        addItem={() =>
                            onOpenAddCategoryDialog({
                                breadcrumbs: [
                                    {
                                        label: t('finance:addTransaction'),
                                        onClick: onCloseAddCategoryDialog,
                                    },
                                    {
                                        label: t(`finance:newCategory`),
                                    },
                                ],
                                categoryType: mode as unknown as CategoryType,
                            })
                        }
                    />

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