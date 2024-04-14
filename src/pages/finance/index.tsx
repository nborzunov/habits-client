import { Box, Flex, Heading, Icon, IconButton, Text, Tooltip } from '@chakra-ui/react';
import { OpenAddTransactionDialogAction } from '@features/add-transaction-dialog';
import { Icons$ } from '@shared/lib';
import { AccountList } from '@widgets/account-list';
import { FinanceWidgets } from '@widgets/finance-dashboard';
import { TransactionList } from '@widgets/transaction-list';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes } from 'react-router-dom';

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
                            icon={<Icon as={Icons$.Search} />}
                            aria-label={'search-transaction'}
                            borderRadius={'lg'}
                        />
                    </Tooltip>

                    <OpenAddTransactionDialogAction />
                </Flex>
            </Flex>
            <Box px={4}>
                <Routes>
                    <Route path={''} element={<FinanceWidgets />} />
                    <Route path={'/transactions'} element={<TransactionList />} />
                    <Route path={'/accounts'} element={<AccountList />} />
                </Routes>
            </Box>
        </Box>
    );
};
