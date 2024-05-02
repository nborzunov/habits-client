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
    useToast,
} from '@chakra-ui/react';
import { Account, useAccounts, useReorderAccounts } from '@entities/account';
import { getAccountTypeColor } from '@entities/finance';
import { useAddAccountDialog } from '@features/add-account-dialog';
import { openAddAccountDialog } from '@features/add-account-dialog';
import { createDialog, openDialog, useDialog } from '@shared/hooks';
import { Icons$, handleError } from '@shared/lib';
import { ListItem } from '@shared/ui/ListItem';
import { SortableList } from '@shared/ui/SortableList';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {};
const AccountManagementDialog = createDialog((_props: Props) => {
    const { t } = useTranslation();
    const toast = useToast();
    const dialog = useAccountManagementDialog();

    const addAccountDialog = useAddAccountDialog();
    const [prevAccounts, setPrevAccounts] = useState<Account[]>([]);

    const { data: accounts = [], refetch: refetchAccounts } = useAccounts({
        select: (data) => (prevAccounts.length > 0 ? prevAccounts : data),
        onSuccess: () => {
            setPrevAccounts([]);
        },
    });

    const { mutate: reorderAccounts } = useReorderAccounts({
        onSuccess: () => refetchAccounts(),
        onError: (err) => handleError({ toast, err }),
    });

    const onDrag = (items: Account[]) => {
        setPrevAccounts(items);

        const itemsToUpdate = items
            .map((item, index) => ({ ...item, a_order: index }))
            .filter((item, index) => item.id !== accounts[index].id)
            .map(({ id, a_order }) => ({ id: id, a_order: a_order }));

        reorderAccounts(itemsToUpdate);
    };
    return (
        <Modal isOpen={dialog.visible} onClose={dialog.hide} closeOnOverlayClick={false}>
            <ModalContent mx={4} visibility={addAccountDialog.visible ? 'hidden' : 'visible'}>
                <ModalHeader>{t(`finance:accountManagement`)}</ModalHeader>
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
                                    color={getAccountTypeColor(account) as string}
                                    icon={Icons$.account_types[account.account_type]}
                                    label={account.name}
                                    onDelete={async () => alert('TODO')}
                                    onEdit={async () => alert('TODO')}
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
                                openAddAccountDialog({
                                    breadcrumbs: [
                                        {
                                            label: t('finance:accountManagement'),
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

export const openAccountManagementDialog = (props: Props) =>
    openDialog(AccountManagementDialog, {
        id: 'AccountManagement',
        ...props,
    });

export const useAccountManagementDialog = () => useDialog(AccountManagementDialog);
