import { AccountType } from '@entities/account';
import { Category } from '@entities/category';
import { AddTransactionMode } from '@features/add-transaction-dialog';
import { PicklistItem } from '@shared/model/types';

import { Currency } from '../model/types';

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

export const getTransactionTypeColor = (transaction_type: string) => {
    switch (transaction_type) {
        case 'income':
            return 'green.500';
        case 'expense':
            return 'red.500';
        case 'transfer':
            return 'blue.500';
    }
};
export const getAccountTypeColor = (account_type: AccountType) => {
    switch (account_type) {
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
    if (category.is_default) {
        return `finance:defaultCategories.${category.category_type}.${category.name}`;
    }
    return category.name;
};

export const transformCategories = (categories: Category[]): PicklistItem<Category>[] => {
    return categories.map((category) => ({
        id: category.id,
        label: category.name,
        value: category,
    }));
};

export const getModeButtonColor = (mode: AddTransactionMode) => {
    switch (mode) {
        case AddTransactionMode.Income:
            return 'green';
        case AddTransactionMode.Expense:
            return 'red';
        case AddTransactionMode.Transfer:
            return 'blue';
    }
};
