import { Flex, Icon, Text } from '@chakra-ui/react';
import { useAccounts } from '@entities/account/api/useAccounts';
import { getAccountTypeColor, getCurrency } from '@entities/finance';
import { WidgetWrapper } from '@entities/finance';
import { Icons$ } from '@shared/lib';
import { useTranslation } from 'react-i18next';

export const AccountsWidget = () => {
    const { t } = useTranslation();
    const { data = [] } = useAccounts();
    const accounts = data.slice(0, 3);

    return (
        <WidgetWrapper
            title={'Accounts'}
            data={data}
            link={'accounts'}
            linkText={t('finance:showAll')}
        >
            {accounts.map((account) => (
                <Flex key={account.id} align={'center'}>
                    <Flex width={'100%'} justify={'space-between'}>
                        <Flex align={'center'}>
                            <Icon
                                as={Icons$.account_types[account.account_type]}
                                fontSize={'2xl'}
                                mr={4}
                                color={getAccountTypeColor(account.account_type)}
                            />
                            <Flex direction={'column'}>
                                <Text fontWeight='bold' fontSize='lg' color='gray.600'>
                                    {account.name}
                                </Text>
                                <Text fontWeight='semibold' fontSize='md'>
                                    {account.amount} {getCurrency(account.currency)}
                                </Text>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            ))}
        </WidgetWrapper>
    );
};
