import { Account } from '@entities/account';
import { Category, CategoryType } from '@entities/category';
import { AddTransactionMode } from '@features/add-transaction-dialog';
import { Icons$ } from '@shared/lib';
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

export const getCategoryIcons = (categoryType: CategoryType) => {
    switch (categoryType) {
        case CategoryType.Expense:
            return Object.keys(Icons$.expenseIcons);
        case CategoryType.Income:
            return Object.keys(Icons$.incomeIcons);
        default:
            return [];
    }
};

export const getCategoryIconsMap = (categoryType: CategoryType) => {
    switch (categoryType) {
        case CategoryType.Expense:
            return Icons$.expenseIcons;
        case CategoryType.Income:
            return Icons$.incomeIcons;
        default:
            return {};
    }
};

export const getCategoryComponents = (categoryType: CategoryType) => {
    switch (categoryType) {
        case CategoryType.Expense:
            return Icons$.expenseIcons;
        case CategoryType.Income:
            return Icons$.incomeIcons;
        default:
            return null;
    }
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
