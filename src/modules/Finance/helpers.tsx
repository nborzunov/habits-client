import { Account, Category, Currency } from '~/modules/Finance/types';

export const getCurrency = (value: string) => {
    if (value) {
        switch (value) {
            case Currency.USD:
                return '$';
            case Currency.EUR:
                return '€';
            case Currency.RUB:
                return '₽';
            case Currency.AMD:
                return '֏';
        }
    }
    return '$';
};

export const getTransactionTypeColor = (transactionType: string) => {
    switch (transactionType) {
        case 'income':
            return 'green.500';
        case 'expense':
            return 'red.500';
        case 'transfer':
            return 'blue.500';
    }
};
export const getAccountTypeColor = (account: Account) => {
    switch (account.accountType) {
        case 'cash':
            return 'orange';
        case 'card':
            return 'teal';
        case 'deposit':
            return 'cyan';
        case 'loan':
            return 'pink';
    }
};

export const getCategoryName = (category: Category) => {
    if (category.default) {
        if (category.categoryType === 'expense') {
            return `finance:defaultExpenseCategories.${category.name}`;
        } else {
            return `finance:defaultIncomeCategories.${category.name}`;
        }
    }
    return category.name;
};
