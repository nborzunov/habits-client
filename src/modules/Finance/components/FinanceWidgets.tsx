import { Box, Button, Divider, Flex, Grid, GridItem, Icon, Stack, Text } from '@chakra-ui/react';
import React, { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Icons from '~/common/helpers/Icons';
import { useTransactions } from '~/modules/Finance/api/transactions/useTransactions';
import {
    getAccountTypeColor,
    getCategoryName,
    getCurrency,
    getTransactionTypeColor,
} from '~/modules/Finance/helpers';

import { useAccounts } from '../api/accounts/useAccounts';

const WidgetWrapper = ({
    title,
    data,
    link,
    linkText,
    children,
}: PropsWithChildren<{ title: string; data: any[]; link: string; linkText: string }>) => (
    <Box
        borderRadius='xl'
        p='2'
        display='flex'
        flexDirection='column'
        height={'100%'}
        position={'relative'}
        w={'450px'}
        px={4}
        py={6}
        bg={'white'}
        boxShadow={'sm'}
    >
        <Flex justifyContent={'space-between'} alignItems={'center'}>
            <Text fontWeight='bold' letterSpacing='wide' fontSize='lg' color='gray.700' pb={2}>
                {title}
            </Text>
        </Flex>

        <Divider h={'2px'} />
        <Flex pt={4} px={2} h='261px' flexDir='column' justifyContent={'space-between'}>
            <Stack spacing={3}>{children}</Stack>

            {data.length > 3 && (
                <Link to={link}>
                    <Button mt={4} width={'100%'} variant='outline' colorScheme={'cyan'}>
                        {linkText} ({data.length})
                    </Button>
                </Link>
            )}
        </Flex>
    </Box>
);
const TransactionsWidget = () => {
    const { t } = useTranslation();
    const { data } = useTransactions();
    const transactions = data.slice(0, 3);

    return (
        <WidgetWrapper
            title={t('finance:allTransactions')}
            data={data}
            link={'transactions'}
            linkText={t('finance:showAll')}
        >
            {transactions.map((transaction) => (
                <Box key={transaction.id} display={'flex'} alignItems={'center'}>
                    <Flex width={'100%'} justifyContent={'space-between'}>
                        <Flex alignItems={'center'}>
                            <Icon
                                as={Icons.transactionTypes[transaction.transactionType]}
                                fontSize={'2xl'}
                                mr={4}
                                color={getTransactionTypeColor(transaction.transactionType)}
                            />
                            <Flex flexDirection={'column'}>
                                <Text fontWeight='bold' fontSize='lg' color='gray.600'>
                                    {transaction.note || t('finance:emptyNote')}{' '}
                                    <Text as={'span'} fontWeight={'semibold'}>
                                        ({t(getCategoryName(transaction.category))})
                                    </Text>
                                </Text>
                                <Flex alignItems={'center'} mt={1}>
                                    <Icon
                                        as={Icons.accountTypes[transaction.account.accountType]}
                                        fontSize={'lg'}
                                        mr={1.5}
                                        color={getAccountTypeColor(transaction.account)}
                                    />
                                    <Text fontWeight='semibold' fontSize='md'>
                                        {transaction.account.name}
                                    </Text>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex>
                        <Text as={Flex} fontWeight='semibold' fontSize='md' columnGap={1}>
                            <span>{transaction.amount}</span>
                            <span>{getCurrency(transaction.account.currency)}</span>
                        </Text>
                    </Flex>
                </Box>
            ))}
        </WidgetWrapper>
    );
};

const AccountsWidget = () => {
    const { t } = useTranslation();
    const { data } = useAccounts();
    const accounts = data.slice(0, 3);

    return (
        <WidgetWrapper
            title={'Accounts'}
            data={data}
            link={'accounts'}
            linkText={t('finance:showAll')}
        >
            {accounts.map((account) => (
                <Box key={account.id} display={'flex'} alignItems={'center'}>
                    <Flex width={'100%'} justifyContent={'space-between'}>
                        <Flex alignItems={'center'}>
                            <Icon
                                as={Icons.accountTypes[account.accountType]}
                                fontSize={'2xl'}
                                mr={4}
                                color={getAccountTypeColor(account)}
                            />
                            <Flex flexDirection={'column'}>
                                <Text fontWeight='bold' fontSize='lg' color='gray.600'>
                                    {account.name}
                                </Text>
                                <Text fontWeight='semibold' fontSize='md'>
                                    {account.amount} {getCurrency(account.currency)}
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                </Box>
            ))}
        </WidgetWrapper>
    );
};
export const FinanceWidgets = () => {
    return (
        <Box>
            <Grid gap={4} templateColumns={'repeat(2, 450px)'}>
                <GridItem>
                    <TransactionsWidget />
                </GridItem>
                <GridItem>
                    <AccountsWidget />
                </GridItem>
            </Grid>
        </Box>
    );
};
