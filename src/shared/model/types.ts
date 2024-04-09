export type SetError<T extends string> = (
    field: T,
    error: {
        type: 'custom';
        message: string;
    },
) => void;

export interface PicklistItem<T> {
    id: string;
    label: string;
    value: T;
}

export enum DialogTypes {
    AddAccountDialog = 'AddAccountDialog',
    AccountManagementDialog = 'AccountManagementDialog',
    AddTransactionDialog = 'AddTransactionDialog',
    AddCategoryDialog = 'AddCategoryDialog',
    CategoryManagementDialog = 'CategoryManagementDialog',
}
