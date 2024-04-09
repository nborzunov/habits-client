import { Currency } from '@entities/finance';

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
