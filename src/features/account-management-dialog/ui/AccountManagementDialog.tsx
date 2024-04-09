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
import { DefaultDialogProps, createDialogProvider } from '@shared/hooks/useDialog';
import { Icons$ } from '@shared/lib';
import { ListItem } from '@shared/ui/ListItem';
import React from 'react';
import { useTranslation } from 'react-i18next';

const AccountManagement = ({ isOpen, onClose }: DefaultDialogProps) => {
    const { t } = useTranslation();

    const {
        isOpen: isOpenAddAccountDialog,
        onOpen: onOpenAddAccountDialog,
        onClose: onCloseAddAccountDialog,
    } = useAddAccountDialog();

    const { data: accounts } = useAccounts();

    return (
        <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
            <ModalContent mx={4} visibility={isOpenAddAccountDialog ? 'hidden' : 'visible'}>
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
                                    Icons$.accountTypes[
                                        account.name as keyof typeof Icons$.accountTypes
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
                        <Button colorScheme='blue' mr={3} size={'md'} onClick={onClose}>
                            {t('common:close')}
                        </Button>
                        <Button
                            colorScheme='green'
                            type='submit'
                            size={'md'}
                            onClick={() =>
                                onOpenAddAccountDialog({
                                    breadcrumbs: [
                                        {
                                            label: t('finance:accountManagement'),
                                            onClick: onCloseAddAccountDialog,
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
};

export const {
    DialogProvider: AccountManagementDialogProvider,
    useDialogAction: useAccountManagementDialog,
} = createDialogProvider(AccountManagement);
