import { Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { useAccounts } from '@entities/account/api/useAccounts';
import { useCategories } from '@entities/category/api/useCategories';
import { useAccountManagementDialog } from '@features/account-management-dialog';
import { useAddAccountDialog } from '@features/add-account-dialog/ui/AddAccountDialog';
import { useAddCategoryDialog } from '@features/add-category-dialog/ui/AddCategory';
import { useCategoryManagementDialog } from '@features/category-management-dialog';
import { DefaultDialogProps, createDialogProvider } from '@shared/hooks';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AddTransactionMode } from '../model/types';
import { AddTransactionForm } from './AddTransactionForm';

const AddTransaction = ({ isOpen, onClose }: DefaultDialogProps) => {
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
