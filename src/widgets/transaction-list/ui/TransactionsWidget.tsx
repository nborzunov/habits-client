import { Box, Flex, Icon, Text } from '@chakra-ui/react';
import {
    WidgetWrapper,
    getAccountTypeColor,
    getCategoryName,
    getCurrency,
    getTransactionTypeColor,
} from '@entities/finance';
import { useTransactions } from '@entities/transaction';
import { Icons$ } from '@shared/lib';
import { useTranslation } from 'react-i18next';

export const TransactionsWidget = () => {
    const { t } = useTranslation();
    const { data = [] } = useTransactions();
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
                                as={Icons$.transaction_types[transaction.transaction_type]}
                                fontSize={'2xl'}
                                mr={4}
                                color={getTransactionTypeColor(transaction.transaction_type)}
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
                                        as={Icons$.account_types[transaction.account.account_type]}
                                        fontSize={'lg'}
                                        mr={1.5}
                                        color={getAccountTypeColor(
                                            transaction.account.account_type,
                                        )}
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
