import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from '@chakra-ui/react';
import { Account, useAccounts, useDeleteAccount, useReorderAccounts } from '@entities/account';
import { getAccountTypeColor } from '@entities/finance';
import {
    openCreateAccountDialog,
    openEditAccountDialog,
    useCreateAccountDialog,
    useEditAccountDialog,
} from '@features/manage-account';
import { createDialog, openDialog, useDialog } from '@shared/hooks';
import { Icons$, handleError, handleSuccess } from '@shared/lib';
import { openConfirmationDialog } from '@shared/ui/ConfirmationDialog';
import { ListItem } from '@shared/ui/ListItem';
import { SortableList } from '@shared/ui/SortableList';
import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {};
const AccountListDialog = createDialog((_props: Props) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const dialog = useAccountListDialog();
    const addAccountDialog = useCreateAccountDialog();
    const editAccountDialog = useEditAccountDialog();

    const [prevAccounts, setPrevAccounts] = useState<Account[]>([]);

    const { data: accounts = [], refetch: refetchAccounts } = useAccounts({
        select: (data) => (prevAccounts.length > 0 ? prevAccounts : data),
        onSuccess: () => {
            setPrevAccounts([]);
        },
    });

    const { mutate: reorderAccounts } = useReorderAccounts({
        onSuccess: () => refetchAccounts(),
        onError: handleError,
    });

    const { mutate: deleteCategory } = useDeleteAccount({
        onSuccess: () => {
            queryClient.invalidateQueries(['transactions']);
            queryClient.invalidateQueries(['accounts']);
            handleSuccess({
                description: 'finance:accountDeleted',
            });
        },
        onError: handleError,
    });

    const onDrag = (items: Account[]) => {
        setPrevAccounts(items);

        const itemsToUpdate = items
            .map((item, index) => ({ ...item, a_order: index }))
            .filter((item, index) => item.id !== accounts[index].id)
            .map(({ id, a_order }) => ({ id: id, a_order: a_order }));

        reorderAccounts(itemsToUpdate);
    };

    const onDelete = (account: Account) => {
        openConfirmationDialog({
            title: t('finance:deleteAccount', { account_name: account.name }),
            // TODO: show amount of transactions that will be deleted
            text: t('finance:deleteAccountWarning'),
            okText: t('common:delete'),
            cancelText: t('common:cancel'),
        })
            .then(() => deleteCategory(account.id))
            .catch(() => {});
    };

    const onEdit = (account: Account) => {
        openEditAccountDialog({
            account,
            breadcrumbs: [
                {
                    label: t('finance:accountList'),
                    onClick: editAccountDialog.hide,
                },
                {
                    label: account.name,
                },
            ],
        });
    };
    return (
        <Modal isOpen={dialog.visible} onClose={dialog.hide} closeOnOverlayClick={false}>
            <ModalContent
                mx={4}
                visibility={
                    addAccountDialog.visible || editAccountDialog.visible ? 'hidden' : 'visible'
                }
            >
                <ModalHeader>{t(`finance:accountList`)}</ModalHeader>
                <ModalCloseButton />
                <ModalBody mt={3}>
                    {!accounts.length && (
                        <Alert status='info'>
                            <AlertIcon />
                            {t('finance:noAccountsWarning')}
                        </Alert>
                    )}

                    <SortableList
                        items={accounts}
                        onChange={onDrag}
                        renderItem={(account) => (
                            <SortableList.Item id={account.id}>
                                <ListItem
                                    id={account.id}
                                    key={account.id}
                                    color={getAccountTypeColor(account.account_type) as string}
                                    icon={Icons$.account_types[account.account_type]}
                                    label={account.name}
                                    onDelete={() => onDelete(account)}
                                    onEdit={() => onEdit(account)}
                                />
                                <SortableList.DragHandle />
                            </SortableList.Item>
                        )}
                    />
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
                            onClick={() =>
                                openCreateAccountDialog({
                                    breadcrumbs: [
                                        {
                                            label: t('finance:accountList'),
                                            onClick: addAccountDialog.hide,
                                        },
                                        {
                                            label: t(`finance:newAccount`),
                                        },
                                    ],
                                })
                            }
                        >
                            {t('finance:newAccount')}
                        </Button>
                    </Box>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
});

export const openAccountListDialog = (props: Props) =>
    openDialog(AccountListDialog, {
        id: 'AccountManagement',
        ...props,
    });

export const useAccountListDialog = () => useDialog(AccountListDialog);
