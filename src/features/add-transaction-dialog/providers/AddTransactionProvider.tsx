import { AccountManagementDialogProvider } from '@features/account-management-dialog';
import { AddAccountDialogProvider } from '@features/add-account-dialog';
import { AddCategoryDialogProvider } from '@features/add-category-dialog';
import { CategoryManagementDialogProvider } from '@features/category-management-dialog';
import { PropsWithChildren, ReactElement } from 'react';

import { AddTransactionDialogProvider } from '../ui/AddTransaction';

export const AddTransactionProvider = ({ children }: PropsWithChildren) => {
    return (
        <AddAccountDialogProvider>
            <AccountManagementDialogProvider>
                <AddCategoryDialogProvider>
                    <CategoryManagementDialogProvider>
                        <AddTransactionDialogProvider>
                            {children as ReactElement}
                        </AddTransactionDialogProvider>
                    </CategoryManagementDialogProvider>
                </AddCategoryDialogProvider>
            </AccountManagementDialogProvider>
        </AddAccountDialogProvider>
    );
};
