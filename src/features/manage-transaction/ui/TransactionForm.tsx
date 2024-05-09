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
import { Category, CategoryType, useCategories } from '@entities/category';
import {
    getAccountTypeColor,
    getCurrency,
    getModeButtonColor,
    transformCategories,
} from '@entities/finance';
import { TransactionType, useCreateTransaction } from '@entities/transaction';
import { openAccountListDialog } from '@features/account-list';
import { openCategoryListDialog } from '@features/category-list';
import { useCreateAccountDialog } from '@features/manage-account';
import { useCreateCategoryDialog } from '@features/manage-category';
import { Icons$, handleError, handleSuccess } from '@shared/lib';
import { validationRules } from '@shared/ui/Form';
import { FormField, SelectFromPicklist } from '@shared/ui/Form';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { AddTransactionMode } from '../model/types';
import { useAddTransactionDialog } from './AddTransactionDialog';

const defaultState: {
    created_date: string;
    account: Account | undefined;
    category: Category | undefined;
    amount: number | '';
    note: string;
} = {
    created_date: dayjs().format('YYYY-MM-DD'),
    account: undefined,
    category: undefined,
    amount: '',
    note: '',
};

export const TransactionForm = ({
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

    const queryClient = useQueryClient();
    const { mutate: createTransaction } = useCreateTransaction({
        onSuccess: () => {
            handleSuccess({
                description: 'finance:transactionCreated',
            });
            handleClose();
            queryClient.invalidateQueries(['transactions']);
        },
        onError: handleError,
    });

    const onFormSubmit = (data: {
        created_date: string;
        account: Account | undefined;
        category: Category | undefined;
        amount: number | '';
        note: string;
    }) => {
        const currentTime = dayjs();
        const created_date = dayjs(data.created_date)
            .add(currentTime.hour(), 'hour')
            .add(currentTime.minute(), 'minute')
            .add(currentTime.second(), 'second');

        createTransaction({
            created_date: created_date.toDate(),
            account_id: data.account?.id as string,
            category_id: data.category?.id as string,
            transaction_type: mode as unknown as TransactionType,
            amount: Number(data.amount) || 0,
            note: data.note,
        });
    };

    const [form, setForm] = useState(defaultState);

    const { data: categories = [] } = useCategories({
        select: (data) => transformCategories(data[mode as unknown as CategoryType]),
    });

    const addAccountDialog = useCreateAccountDialog();
    const createCategoryDialog = useCreateCategoryDialog();

    const openCreateAccountDialog = useCallback(
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

    const openCreateCategoryDialog = useCallback(
        () =>
            createCategoryDialog.show({
                breadcrumbs: [
                    {
                        label: t('finance:addTransaction'),
                        onClick: createCategoryDialog.hide,
                    },
                    {
                        label: t(`finance:categories.newCategory`),
                    },
                ],

                category_type: mode,
            }),
        [t, createCategoryDialog, mode],
    );

    const clearForm = useCallback(() => {
        setValue('account', undefined);
        setValue('category', undefined);
        setValue('amount', '');
        setValue('note', '');
        setForm(defaultState);
        setMode(AddTransactionMode.Expense);
    }, [setValue, setMode]);

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
                            {t(`finance:transaction_types.${m}`)}
                        </Button>
                    ))}
                </HStack>

                <Stack>
                    <FormField
                        label={t('finance:date')}
                        validationProps={register('created_date', validationRules.text(2))}
                        validationError={errors.created_date}
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
                            </>
                        }
                        editButton={
                            <Tooltip label={t('finance:manageAccounts')}>
                                <IconButton
                                    icon={<Icon as={Icons$.Settings} />}
                                    aria-label={'manage accounts'}
                                    size={'xs'}
                                    variant={'ghost'}
                                    onClick={() => openAccountListDialog({})}
                                ></IconButton>
                            </Tooltip>
                        }
                        addItem={openCreateAccountDialog}
                        renderItem={(account) => (
                            <Flex width='100%' alignItems='center'>
                                <Icon
                                    as={Icons$.account_types[account.account_type]}
                                    fontSize={'4xl'}
                                    color={`${getAccountTypeColor(account.account_type)}.500`}
                                    p={2}
                                    borderRadius={'xl'}
                                    boxShadow={'sm'}
                                />
                                <span>{account.name}</span>
                            </Flex>
                        )}
                    />
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
                                        openCategoryListDialog({
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
                            </>
                        }
                        addItem={openCreateCategoryDialog}
                        renderItem={(category) => (
                            <Flex width='100%' alignItems='center' h='36px'>
                                <Icon
                                    as={
                                        Icons$.categoryIcons[category.category_type][
                                            category.icon as keyof (typeof Icons$.categoryIcons)[CategoryType]
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
