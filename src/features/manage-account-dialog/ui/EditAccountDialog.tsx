import { Account, useEditAccount } from '@entities/account';
import { createDialog, openDialog, useDialog } from '@shared/hooks';
import { handleError, handleSuccess } from '@shared/lib';
import { BreadcrumbsProps } from '@shared/ui/Breadcrumbs';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { AccountForm } from './AccountForm';

type Props = {
    account: Account;
} & BreadcrumbsProps;

const EditAccountDialog = createDialog(({ account, breadcrumbs }: Props) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const dialog = useEditAccountDialog();

    const { mutate: updateAccount } = useEditAccount({
        onSuccess: () => {
            dialog.hide();
            queryClient.invalidateQueries(['accounts']);

            handleSuccess({
                description: 'finance:accountUpdated',
            });
        },
        onError: handleError,
    });

    return (
        <AccountForm
            actionButtonLabel={t('common:update')}
            initialState={account}
            onSubmit={(data) => updateAccount({ account_id: account.id, data })}
            breadcrumbs={breadcrumbs}
            dialog={dialog}
        />
    );
});

export const openEditAccountDialog = (props: Props) =>
    openDialog(EditAccountDialog, {
        id: 'EditAccount',
        ...props,
    });

export const useEditAccountDialog = () => useDialog(EditAccountDialog);
