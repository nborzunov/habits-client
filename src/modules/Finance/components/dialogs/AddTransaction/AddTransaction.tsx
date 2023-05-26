import { Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DefaultDialogProps } from '~/common/hooks/useDIalog.types';
import { createDialogProvider } from '~/common/hooks/useDialog';
import { useAccounts } from '~/modules/Finance/api/accounts/useAccounts';
import { useCategories } from '~/modules/Finance/api/categories/useCategories';
import { useAccountManagementDialog } from '~/modules/Finance/components/dialogs/AccountManagement/AccountManagement';
import { useAddAccountDialog } from '~/modules/Finance/components/dialogs/AccountManagement/AddAccount';
import { AddTransactionForm } from '~/modules/Finance/components/dialogs/AddTransaction/AddTransactionForm';
import { useAddCategoryDialog } from '~/modules/Finance/components/dialogs/CategoryManagement/AddCategory';
import { useCategoryManagementDialog } from '~/modules/Finance/components/dialogs/CategoryManagement/CategoryManagement';

export enum AddTransactionMode {
    Income = 'income',
    Expense = 'expense',
    Transfer = 'transfer',
}

export const AddTransaction = ({ isOpen, onClose }: DefaultDialogProps) => {
    const [mode, setMode] = useState<AddTransactionMode>(AddTransactionMode.Expense);
    const [[handleClose], setHandleClose] = useState<Array<() => void>>([onClose]);
    const { t } = useTranslation();

    const {
        data: { income: incomeCategories, expense: expenseCategories },
    } = useCategories();
    const { data: accounts } = useAccounts();

    const { isOpen: isOpenAddAccountDialog } = useAddAccountDialog();
    const { isOpen: isOpenAddAccountManagementDialog } = useAccountManagementDialog();
    const { isOpen: isOpenAddCategoryDialog } = useAddCategoryDialog();
    const { isOpen: isOpenCategoryManagementDialog } = useCategoryManagementDialog();

    return (
        <Modal isOpen={isOpen} onClose={handleClose} closeOnOverlayClick={false} size={'lg'}>
            <ModalOverlay />
            <ModalContent
                p={0}
                visibility={
                    isOpenAddAccountDialog ||
                    isOpenAddAccountManagementDialog ||
                    isOpenAddCategoryDialog ||
                    isOpenCategoryManagementDialog
                        ? 'hidden'
                        : 'visible'
                }
            >
                <ModalHeader>{t(`finance:transactionTypes.${mode}`)}</ModalHeader>
                <ModalCloseButton />
                {mode !== AddTransactionMode.Transfer && (
                    <AddTransactionForm
                        setMode={setMode}
                        mode={mode}
                        onClose={onClose}
                        setOnClose={setHandleClose}
                        incomeCategories={incomeCategories}
                        expenseCategories={expenseCategories}
                        accounts={accounts}
                    />
                )}
            </ModalContent>
        </Modal>
    );
};

export const {
    DialogProvider: AddTransactionDialogProvider,
    useDialogAction: useAddTransactionDialog,
} = createDialogProvider(AddTransaction);