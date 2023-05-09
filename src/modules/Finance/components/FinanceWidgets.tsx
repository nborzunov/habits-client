import { Box, Button, Divider, Flex, Icon, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Icons from '~/common/helpers/Icons';
import { useTransactions } from '~/modules/Finance/api/useTransactions';
import {
    getAccountTypeColor,
    getCategoryName,
    getCurrency,
    getTransactionTypeColor,
} from '~/modules/Finance/helpers';

export const FinanceWidgets = () => {
    const { t } = useTranslation();

    const { data } = useTransactions();
    const transactions = data.slice(0, 3);

    return (
        <Box>
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
                    <Text
                        fontWeight='bold'
                        letterSpacing='wide'
                        fontSize='lg'
                        color='gray.700'
                        pb={2}
                    >
                        {t('finance:allTransactions')}
                    </Text>
                </Flex>

                <Divider h={'2px'} />

                <Box pt={4} px={2}>
                    <Stack spacing={3}>
                        {transactions.map((transaction) => (
                            <Box key={transaction.id} display={'flex'} alignItems={'center'}>
                                <Flex width={'100%'} justifyContent={'space-between'}>
                                    <Flex alignItems={'center'}>
                                        <Icon
                                            as={Icons.transactionTypes[transaction.transactionType]}
                                            fontSize={'2xl'}
                                            mr={4}
                                            color={getTransactionTypeColor(
                                                transaction.transactionType,
                                            )}
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
                                                    as={
                                                        Icons.accountTypes[
                                                            transaction.account.accountType
                                                        ]
                                                    }
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
                                    <Text
                                        as={Flex}
                                        fontWeight='semibold'
                                        fontSize='md'
                                        columnGap={1}
                                    >
                                        <span>{transaction.amount}</span>
                                        <span>{getCurrency(transaction.account.currency)}</span>
                                    </Text>
                                </Flex>
                            </Box>
                        ))}
                    </Stack>
                    <Link to={'transactions'}>
                        <Button mt={4} width={'100%'} variant='outline' colorScheme={'cyan'}>
                            {t('finance:showAll')}
                        </Button>
                    </Link>
                </Box>
            </Box>
        </Box>
    );
};
