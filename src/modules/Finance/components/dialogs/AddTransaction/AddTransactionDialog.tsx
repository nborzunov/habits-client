import { Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDialog } from '~/common/hooks/useDialog';
import { useAccounts } from '~/modules/Finance/api/useAccounts';
import { useCategories } from '~/modules/Finance/api/useCategories';
import { AddTransactionForm } from '~/modules/Finance/components/dialogs/AddTransaction/AddTransactionForm';
import { DialogTypes } from '~/modules/Finance/types';

export enum AddTransactionMode {
    Income = 'income',
    Expense = 'expense',
    Transfer = 'transfer',
}

export const AddTransactionDialog = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    const [mode, setMode] = useState<AddTransactionMode>(AddTransactionMode.Expense);
    const [[handleClose], setHandleClose] = useState<Array<() => void>>([onClose]);
    const { t } = useTranslation();

    const {
        data: { income: incomeCategories, expense: expenseCategories },
    } = useCategories();
    const { data: accounts } = useAccounts();

    const { isOpen: isOpenAddAccountDialog } = useDialog(DialogTypes.AddAccountDialog);
    const { isOpen: isOpenAddAccountManagementDialog } = useDialog(
        DialogTypes.AccountManagementDialog,
    );
    const { isOpen: isOpenAddCategoryDialog } = useDialog(DialogTypes.AddCategoryDialog);
    const { isOpen: isOpenCategoryManagementDialog } = useDialog(
        DialogTypes.CategoryManagementDialog,
    );

    return (
        <Modal isOpen={isOpen} onClose={handleClose} closeOnOverlayClick={false}>
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
