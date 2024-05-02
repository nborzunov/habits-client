import {
    Button,
    FormControl,
    FormLabel,
    HStack,
    Input,
    InputGroup,
    InputRightElement,
} from '@chakra-ui/react';
import { AccountType } from '@entities/account';
import { Currency, getAccountTypeColor, getCurrency } from '@entities/finance';
import { SelectFromPicklist } from '@shared/ui/Form';
import { UseFormRegisterReturn, UseFormSetValue } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { CreateAccountData } from '../model/types';

export const NameField = ({
    value,
    registerProps,
}: {
    value?: string;
    registerProps: UseFormRegisterReturn<'name'>;
}) => {
    const { t } = useTranslation();

    return (
        <FormControl isRequired>
            <FormLabel>{t('finance:name')}</FormLabel>

            <Input
                type={'text'}
                value={value}
                placeholder={t('finance:name') as string}
                {...registerProps}
            />
        </FormControl>
    );
};

export const AccountTypeField = ({
    value,
    setValue,
}: {
    value: AccountType | '';
    setValue: UseFormSetValue<CreateAccountData>;
}) => {
    const { t } = useTranslation();

    return (
        <FormControl isRequired>
            <FormLabel>{t('finance:account_type')}</FormLabel>
            <InputGroup>
                <HStack spacing={2}>
                    {Object.values(AccountType).map((account_type) => (
                        <Button
                            key={account_type}
                            variant={value === account_type ? 'outline' : 'solid'}
                            colorScheme={
                                value === account_type ? getAccountTypeColor(account_type) : 'gray'
                            }
                            onClick={() => setValue('account_type', account_type)}
                            w={'33%'}
                        >
                            {t(`finance:account_types.${account_type}`)}
                        </Button>
                    ))}
                </HStack>
            </InputGroup>
        </FormControl>
    );
};

export const CurrencyField = ({
    value,
    setValue,
}: {
    value: Currency | '';
    setValue: UseFormSetValue<CreateAccountData>;
}) => {
    const { t } = useTranslation();

    const formattedValue = value
        ? {
              id: value,
              name: value,
          }
        : undefined;
    return (
        <SelectFromPicklist
            value={formattedValue}
            name={t('finance:currency')}
            onChange={(value) => setValue('currency', value.id as Currency)}
            title={t('finance:selectCurrency')}
            items={Object.values(Currency).map((currency) => ({
                id: currency,
                label: currency,
                value: {
                    id: currency,
                    name: currency,
                },
            }))}
            renderItem={(currency) => currency.name}
        />
    );
};

export const AmountField = ({
    value,
    currency,
    registerProps,
}: {
    value: number | '';
    currency: Currency | '';
    registerProps: UseFormRegisterReturn<'amount'>;
}) => {
    const { t } = useTranslation();
    return (
        <FormControl isDisabled={!currency}>
            <FormLabel>{t('finance:amount')}</FormLabel>
            <InputGroup>
                <Input
                    type={'number'}
                    value={value as number}
                    placeholder={t('finance:enterAmount') as string}
                    {...registerProps}
                />
                <InputRightElement pointerEvents='none' color='gray.400'>
                    {getCurrency(currency || '')}
                </InputRightElement>
            </InputGroup>
        </FormControl>
    );
};
