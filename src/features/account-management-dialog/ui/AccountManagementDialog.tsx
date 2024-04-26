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
    Stack,
} from '@chakra-ui/react';
import { useAccounts } from '@entities/account';
import { getAccountTypeColor } from '@entities/finance';
import { useAddAccountDialog } from '@features/add-account-dialog';
import { openAddAccountDialog } from '@features/add-account-dialog/ui/AddAccountDialog';
import { createDialog, openDialog, useDialog } from '@shared/hooks';
import { Icons$ } from '@shared/lib';
import { ListItem } from '@shared/ui/ListItem';
import React from 'react';
import { useTranslation } from 'react-i18next';

type Props = {};
const AccountManagementDialog = createDialog((_props: Props) => {
    const { t } = useTranslation();
    const dialog = useAccountManagementDialog();

    const addAccountDialog = useAddAccountDialog();

    const { data: accounts } = useAccounts();

    return (
        <Modal isOpen={dialog.visible} onClose={dialog.hide} closeOnOverlayClick={false}>
            <ModalContent mx={4} visibility={addAccountDialog.visible ? 'hidden' : 'visible'}>
                <ModalHeader>{t(`finance:accountManagement`)}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {!accounts.length && (
                        <Alert status='info'>
                            <AlertIcon />
                            {t('finance:noAccountsWarning')}
                        </Alert>
                    )}

                    <Stack spacing={3} mt={3}>
                        {accounts.map((account) => (
                            <ListItem
                                id={account.id}
                                key={account.id}
                                color={getAccountTypeColor(account) as string}
                                icon={
                                    Icons$.account_types[
                                        account.name as keyof typeof Icons$.account_types
                                    ]
                                }
                                label={account.name}
                                onDelete={async () => alert('TODO')}
                                onEdit={async () => alert('TODO')}
                            />
                        ))}
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
