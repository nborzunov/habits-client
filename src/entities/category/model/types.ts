export interface Category {
    id: string;
    name: string;
    icon: string;
    color: string;
    category_type: CategoryType;
    is_default: boolean;
}

export enum CategoryType {
    Income = 'income',
    Expense = 'expense',
}
