import {
    Box,
    Flex,
    Grid,
    GridItem,
    Icon,
    Stack,
    Tab,
    TabIndicator,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Icons from '~/common/helpers/Icons';
import { useTransactions } from '~/modules/Finance/api/useTransactions';
import {
    getAccountTypeColor,
    getCategoryName,
    getCurrency,
    getTransactionTypeColor,
} from '~/modules/Finance/helpers';
import { Transaction } from '~/modules/Finance/types';

export const TransactionsList = () => {
    const { data } = useTransactions();
    const { t } = useTranslation();

    const groupByDate = (transactions: Transaction[]): Record<string, Transaction[]> => {
        return transactions.reduce<Record<string, Transaction[]>>((acc, transaction) => {
            const date = new Date(transaction.date).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(transaction);
            return acc;
        }, {});
    };

    const groupedTransactions = groupByDate(data);
    return (
        <Box>
            <Tabs>
                <TabList>
                    {['history', 'upcoming'].map((item) => (
                        <Tab
                            key={item}
                            _selected={{ color: 'green.500' }}
                            isDisabled={item === 'upcoming'}
                        >
                            <Text py={2} fontSize={'lg'} fontWeight={'bold'}>
                                {t(`finance:${item}`)}
                            </Text>
                        </Tab>
                    ))}
                </TabList>

                <TabIndicator mt='-1.5px' height='1px' bg='green.500' borderRadius='1px' />
                <TabPanels>
                    <TabPanel>
                        <Grid gridTemplateColumns={'maxmin(1.5fr, 700px), 1fr'}>
                            <GridItem>
                                {Object.entries(groupedTransactions).map(([date, transactions]) => (
                                    <Box key={date} maxWidth={'900px'}>
                                        <Text
                                            fontWeight={'semibold'}
                                            fontSize={'lg'}
                                            color={'gray.600'}
                                            pt={6}
                                            pb={3}
                                        >
                                            {dayjs(date).format('DD MMM, YYYY')}
                                        </Text>
                                        <Stack spacing={3}>
                                            {transactions.map((transaction) => (
                                                <Box
                                                    key={transaction.id}
                                                    display={'flex'}
                                                    alignItems={'center'}
                                                >
                                                    <Grid
                                                        width='100%'
                                                        gridTemplateColumns={'2.5fr 1.5fr 1fr'}
                                                    >
                                                        <GridItem>
                                                            <Flex alignItems={'center'}>
                                                                <Icon
                                                                    as={
                                                                        Icons.transactionTypes[
                                                                            transaction
                                                                                .transactionType
                                                                        ]
                                                                    }
                                                                    fontSize={'2xl'}
                                                                    mr={4}
                                                                    color={getTransactionTypeColor(
                                                                        transaction.transactionType,
                                                                    )}
                                                                />
                                                                <Flex flexDirection={'column'}>
                                                                    <Text
                                                                        fontWeight='bold'
                                                                        fontSize='lg'
                                                                        color='gray.900'
                                                                    >
                                                                        {transaction.note ||
                                                                            t(
                                                                                'finance:emptyNote',
                                                                            )}{' '}
                                                                        <Text
                                                                            as={'span'}
                                                                            fontWeight={'semibold'}
                                                                        >
                                                                            (
                                                                            {t(
                                                                                getCategoryName(
                                                                                    transaction.category,
                                                                                ),
                                                                            )}
                                                                            )
                                                                        </Text>
                                                                    </Text>
                                                                    <Flex
                                                                        alignItems={'center'}
                                                                        mt={1}
                                                                    >
                                                                        <Text
                                                                            fontWeight='semibold'
                                                                            fontSize='md'
                                                                        >
                                                                            {dayjs(
                                                                                transaction.date,
                                                                            ).format(
                                                                                'DD MMM, YYYY, HH:mm A',
                                                                            )}
                                                                        </Text>
                                                                    </Flex>
                                                                </Flex>
                                                            </Flex>
                                                        </GridItem>
                                                        <GridItem>
                                                            <Flex alignItems={'center'} h={'100%'}>
                                                                <Icon
                                                                    as={
                                                                        Icons.accountTypes[
                                                                            transaction.account
                                                                                .accountType
                                                                        ]
                                                                    }
                                                                    fontSize={'4xl'}
                                                                    mr={2}
                                                                    color={`${getAccountTypeColor(
                                                                        transaction.account,
                                                                    )}.500`}
                                                                    bg={`${getAccountTypeColor(
                                                                        transaction.account,
                                                                    )}.50`}
                                                                    p={2}
                                                                    borderRadius={'xl'}
                                                                    boxShadow={'sm'}
                                                                />
                                                                <Text
                                                                    fontWeight='semibold'
                                                                    fontSize='lg'
                                                                    color={'gray.600'}
                                                                >
                                                                    {transaction.account.name}
                                                                </Text>
                                                            </Flex>
                                                        </GridItem>
                                                        <GridItem>
                                                            <Flex alignItems={'center'} h={'100%'}>
                                                                <Text
                                                                    as={Flex}
                                                                    fontWeight='semibold'
                                                                    fontSize='md'
                                                                    columnGap={1}
                                                                    color={
                                                                        transaction.transactionType ===
                                                                        'income'
                                                                            ? 'green.500'
                                                                            : 'gray.900'
                                                                    }
                                                                >
                                                                    <span>
                                                                        {transaction.transactionType ===
                                                                        'income'
                                                                            ? '+ '
                                                                            : '– '}
                                                                        {transaction.amount}
                                                                    </span>
                                                                    <span>
                                                                        {getCurrency(
                                                                            transaction.account
                                                                                .currency,
                                                                        )}
                                                                    </span>
                                                                </Text>
                                                            </Flex>
                                                        </GridItem>
                                                    </Grid>
                                                </Box>
                                            ))}
                                        </Stack>
                                    </Box>
                                ))}
                            </GridItem>
                        </Grid>
                    </TabPanel>
                    <TabPanel>
                        <p>two!</p>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
};
