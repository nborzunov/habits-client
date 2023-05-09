import {
    Alert,
    AlertIcon,
    Box,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Button,
    Flex,
    Icon,
    IconButton,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Stack,
    Text,
    Tooltip,
} from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Icons from '~/common/helpers/Icons';
import { useDialog } from '~/common/hooks/useDialog';
import { useAccounts } from '~/modules/Finance/api/useAccounts';
import { AddAccountDialog } from '~/modules/Finance/components/dialogs/AccountManagement/AddAccountDialog';
import { getAccountTypeColor } from '~/modules/Finance/helpers';
import { DialogTypes } from '~/modules/Finance/types';

export const AccountManagementDialog = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    const { t } = useTranslation();

    const {
        isOpen: isOpenAddAccountDialog,
        onOpen: onOpenAddAccountDialog,
        onClose: onCloseAddAccountDialog,
    } = useDialog(DialogTypes.AddAccountDialog);

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
                            <Flex key={account.id} justifyContent={'space-between'}>
                                <Flex alignItems={'center'} h={'100%'}>
                                    <Icon
                                        as={Icons.accountTypes[account.accountType]}
                                        fontSize={'4xl'}
                                        mr={2}
                                        color={`${getAccountTypeColor(account)}.500`}
                                        bg={`${getAccountTypeColor(account)}.50`}
                                        p={2}
                                        borderRadius={'xl'}
                                        boxShadow={'sm'}
                                    />
                                    <Text fontWeight='semibold' fontSize='lg' color={'gray.600'}>
                                        {account.name}
                                    </Text>
                                </Flex>

                                <Tooltip label={t('common:delete')}>
                                    <IconButton
                                        icon={<Icon as={Icons.Delete} />}
                                        aria-label={'delete'}
                                        colorScheme='red'
                                        variant='outline'
                                        size='sm'
                                        onClick={() => alert('TODO')}
                                    />
                                </Tooltip>
                            </Flex>
                        ))}
                    </Stack>

                    <AddAccountDialog
                        isOpen={isOpenAddAccountDialog}
                        onClose={onCloseAddAccountDialog}
                        header={
                            <Breadcrumb>
                                <BreadcrumbItem>
                                    <BreadcrumbLink onClick={onCloseAddAccountDialog}>
                                        {t('finance:accountManagement')}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>

                                <BreadcrumbItem isCurrentPage>
                                    <BreadcrumbLink>{t(`finance:newAccount`)}</BreadcrumbLink>
                                </BreadcrumbItem>
                            </Breadcrumb>
                        }
                    />
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
                            onClick={onOpenAddAccountDialog}
                        >
                            {t('finance:newAccount')}
                        </Button>
                    </Box>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
