import { Modal, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { useAccounts } from '@entities/account/api/useAccounts';
import { useAccountListDialog } from '@features/account-list';
import { useCategoryListDialog } from '@features/category-list';
import { useCreateAccountDialog } from '@features/manage-account';
import { useCreateCategoryDialog } from '@features/manage-category';
import { createDialog, openDialog, useDialog } from '@shared/hooks';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AddTransactionMode } from '../model/types';
import { TransactionForm } from './TransactionForm';

type Props = {};
const AddTransactionDialog = createDialog(() => {
    const [mode, setMode] = useState<AddTransactionMode>(AddTransactionMode.Expense);
    const { t } = useTranslation();

    const { data: accounts = [] } = useAccounts();

    const addAccountDialog = useCreateAccountDialog();
    const accountListDialog = useAccountListDialog();
    const createCategoryDialog = useCreateCategoryDialog();
    const categoryListDialog = useCategoryListDialog();

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
                    accountListDialog.visible ||
                    createCategoryDialog.visible ||
                    categoryListDialog.visible
                        ? 'hidden'
                        : 'visible'
                }
            >
                <ModalHeader>{t(`finance:transaction_types.${mode}`)}</ModalHeader>
                <ModalCloseButton />
                {mode !== AddTransactionMode.Transfer && (
                    <TransactionForm setMode={setMode} mode={mode} accounts={accounts} />
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
