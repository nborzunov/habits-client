import { Account } from '@entities/account';
import { Category } from '@entities/category';

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
