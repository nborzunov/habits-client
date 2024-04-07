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
import React from 'react';
import { useTranslation } from 'react-i18next';
import Icons from '~/common/helpers/Icons';
import { DefaultDialogProps } from '~/common/hooks/useDIalog.types';
import { createDialogProvider } from '~/common/hooks/useDialog';
import { useAccounts } from '~/modules/Finance/api/accounts/useAccounts';
import { useAddAccountDialog } from '~/modules/Finance/components/dialogs/AddAccount';
import { getAccountTypeColor } from '~/modules/Finance/helpers';

import { ListItem } from '../ListItem';

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
                                icon={Icons.accountTypes[account.accountType]}
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
