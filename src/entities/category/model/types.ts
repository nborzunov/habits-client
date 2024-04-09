export interface Category {
    id: string;
    name: string;
    icon: string;
    color: string;
    categoryType: CategoryType;
    default: boolean;
}

export enum CategoryType {
    Income = 'income',
    Expense = 'expense',
}
