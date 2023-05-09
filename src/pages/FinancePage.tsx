import {
    Box,
    Flex,
    Heading,
    Icon,
    IconButton,
    Text,
    Tooltip,
    useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes } from 'react-router-dom';
import Icons from '~/common/helpers/Icons';
import { FinanceWidgets } from '~/modules/Finance/components/FinanceWidgets';
import { TransactionsList } from '~/modules/Finance/components/Transactions/TransactionsList';
import { AddTransactionDialog } from '~/modules/Finance/components/dialogs/AddTransaction/AddTransactionDialog';

export const FinancePage = () => {
    const { t } = useTranslation();

    const {
        isOpen: isOpenAddTransaction,
        onOpen: onOpenAddTransaction,
        onClose: onCloseAddTransaction,
    } = useDisclosure();

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
                    <Tooltip label={t('finance:addTransaction')}>
                        <IconButton
                            size={'lg'}
                            colorScheme={'teal'}
                            icon={<Icon as={Icons.Add} />}
                            aria-label={'add-transaction'}
                            borderRadius={'lg'}
                            onClick={onOpenAddTransaction}
                        />
                    </Tooltip>
                    <AddTransactionDialog
                        isOpen={isOpenAddTransaction}
                        onClose={onCloseAddTransaction}
                    />
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
