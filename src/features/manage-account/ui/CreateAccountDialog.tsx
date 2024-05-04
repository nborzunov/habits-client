import { CreateAccountData, useCreateAccount } from '@entities/account';
import { createDialog, openDialog, useDialog } from '@shared/hooks';
import { handleError, handleSuccess } from '@shared/lib';
import { BreadcrumbsProps } from '@shared/ui/Breadcrumbs';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { AccountForm } from './AccountForm';

type Props = {} & BreadcrumbsProps;

const createAccountInitialState: CreateAccountData = {
    name: '',
    account_type: '',
    currency: '',
    amount: '',
};

const CreateAccountDialog = createDialog(({ breadcrumbs }: Props) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const dialog = useCreateAccountDialog();

    const { mutate: createAccount } = useCreateAccount({
        onSuccess: () => {
            dialog.hide();
            queryClient.invalidateQueries(['accounts']);

            handleSuccess({
                description: 'finance:accountCreated',
            });
        },
        onError: handleError,
    });

    return (
        <AccountForm
            actionButtonLabel={t('common:create')}
            initialState={createAccountInitialState}
            onSubmit={createAccount}
            breadcrumbs={breadcrumbs}
            dialog={dialog}
        />
    );
});

export const openCreateAccountDialog = (props: Props) =>
    openDialog(CreateAccountDialog, {
        id: 'CreateAccount',
        ...props,
    });

export const useCreateAccountDialog = () => useDialog(CreateAccountDialog);
