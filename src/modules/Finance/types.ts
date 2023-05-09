export enum Currency {
    RUB = 'RUB',
    USD = 'USD',
    EUR = 'EUR',
    AMD = 'AMD',
}

export enum AccountType {
    Cash = 'cash',
    Card = 'card',
    Deposit = 'deposit',
    Loan = 'loan',
}

export interface Account {
    id: string;
    name: string;
    currency: Currency;
    accountType: AccountType;
    amount: number;
}

export interface Category {
    id: string;
    parentId: string | null;
    name: string;
    categoryType: CategoryType;
    children: Category[];
    default: boolean;
}

export enum CategoryType {
    Income = 'income',
    Expense = 'expense',
}

export interface PicklistItem<T> {
    id: string;
    label: string;
    value: T;
    children?: PicklistItem<T>[];
}

export enum DialogTypes {
    AddAccountDialog = 'AddAccountDialog',
    AccountManagementDialog = 'AccountManagementDialog',
    AddTransactionDialog = 'AddTransactionDialog',
    AddCategoryDialog = 'AddCategoryDialog',
    CategoryManagementDialog = 'CategoryManagementDialog',
}

export interface Transaction {
    id: string;
    account: Account;
    category: Category;
    transactionType: TransactionType;
    amount: number;
    note: string;
    date: Date;
}

export enum TransactionType {
    Income = 'income',
    Expense = 'expense',
}
