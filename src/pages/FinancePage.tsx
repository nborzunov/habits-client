import { Box, Flex, Heading, Icon, IconButton, Text, Tooltip } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes } from 'react-router-dom';
import Icons from '~/common/helpers/Icons';
import { FinanceWidgets } from '~/modules/Finance/components/FinanceWidgets';
import { TransactionsList } from '~/modules/Finance/components/Transactions/TransactionsList';
import { AccountManagementDialogProvider } from '~/modules/Finance/components/dialogs/AccountManagement/AccountManagement';
import { AddAccountDialogProvider } from '~/modules/Finance/components/dialogs/AccountManagement/AddAccount';
import {
    AddTransactionDialogProvider,
    useAddTransactionDialog,
} from '~/modules/Finance/components/dialogs/AddTransaction/AddTransaction';
import { AddCategoryDialogProvider } from '~/modules/Finance/components/dialogs/CategoryManagement/AddCategory';
import { CategoryManagementDialogProvider } from '~/modules/Finance/components/dialogs/CategoryManagement/CategoryManagement';

export const OpenAddTransactionDialogButton = () => {
    const { onOpen: onOpenAddTransaction } = useAddTransactionDialog();
    const { t } = useTranslation();

    return (
        // eslint-disable-next-line
        // @ts-ignore
        <Tooltip label={t('finance:addTransaction')}>
            <IconButton
                size={'lg'}
                colorScheme={'teal'}
                icon={<Icon as={Icons.Add} />}
                aria-label={'add-transaction'}
                borderRadius={'lg'}
                onClick={() => onOpenAddTransaction()}
            />
        </Tooltip>
    );
};

export const FinancePage = () => {
    const { t } = useTranslation();

    return (
        <Box>
            <Flex justifyContent='space-between' p='6' py='8'>
                <Flex flexDir='column'>
                    <Heading fontSize='24px'>Hello, Nikolay👋</Heading>
                    <Text color='gray.500'>Let&apos;s check your stats today!</Text>
                </Flex>

                <Flex gap='4'>
                    <Tooltip label={t('finance:searchTransaction')}>
                        <IconButton
                            size={'lg'}
                            colorScheme={'teal'}
                            variant={'ghost'}
                            icon={<Icon as={Icons.Search} />}
                            aria-label={'search-transaction'}
                            borderRadius={'lg'}
                        />
                    </Tooltip>

                    <AddAccountDialogProvider>
                        <AccountManagementDialogProvider>
                            <AddCategoryDialogProvider>
                                <CategoryManagementDialogProvider>
                                    <AddTransactionDialogProvider>
                                        <OpenAddTransactionDialogButton />
                                    </AddTransactionDialogProvider>
                                </CategoryManagementDialogProvider>
                            </AddCategoryDialogProvider>
                        </AccountManagementDialogProvider>
                    </AddAccountDialogProvider>
                </Flex>
            </Flex>
            <Box px={4}>
                <Routes>
                    <Route path={''} element={<FinanceWidgets />} />
                    <Route path={'/transactions'} element={<TransactionsList />} />
                </Routes>
            </Box>
        </Box>
    );
};
