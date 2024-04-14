import { Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { useAccounts } from '@entities/account/api/useAccounts';
import { useAccountManagementDialog } from '@features/account-management-dialog';
import { useAddAccountDialog } from '@features/add-account-dialog/ui/AddAccountDialog';
import { useAddCategoryDialog } from '@features/add-category-dialog/ui/AddCategoryDialog';
import { useCategoryManagementDialog } from '@features/category-management-dialog';
import { createDialog, openDialog, useDialog } from '@shared/hooks';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AddTransactionMode } from '../model/types';
import { AddTransactionForm } from './AddTransactionForm';

type Props = {};
const AddTransactionDialog = createDialog(() => {
    const [mode, setMode] = useState<AddTransactionMode>(AddTransactionMode.Expense);
    const { t } = useTranslation();

    const { data: accounts } = useAccounts();

    const addAccountDialog = useAddAccountDialog();
    const accountManagementDialog = useAccountManagementDialog();
    const addCategoryDialog = useAddCategoryDialog();
    const categoryManagementDialog = useCategoryManagementDialog();

    const dialog = useAddTransactionDialog();

    return (
        <Modal
            isOpen={dialog.visible}
            onClose={dialog.hide}
            closeOnOverlayClick={false}
            size={'lg'}
        >
            <ModalOverlay />
            <ModalContent
                p={0}
                visibility={
                    addAccountDialog.visible ||
                    accountManagementDialog.visible ||
                    addCategoryDialog.visible ||
                    categoryManagementDialog.visible
                        ? 'hidden'
                        : 'visible'
                }
            >
                <ModalHeader>{t(`finance:transactionTypes.${mode}`)}</ModalHeader>
                <ModalCloseButton />
                {mode !== AddTransactionMode.Transfer && (
                    <AddTransactionForm setMode={setMode} mode={mode} accounts={accounts} />
                )}
            </ModalContent>
        </Modal>
    );
});

export const openAddTransactionDialog = (props: Props) =>
    openDialog(AddTransactionDialog, {
        id: 'AddTransaction',
        ...props,
    });

export const useAddTransactionDialog = () => useDialog(AddTransactionDialog);
