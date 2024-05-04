import { CategoryData, useCreateCategory } from '@entities/category';
import { CategoryType } from '@entities/category';
import { createDialog, openDialog, useDialog } from '@shared/hooks';
import { handleError, handleSuccess } from '@shared/lib';
import { BreadcrumbsProps } from '@shared/ui/Breadcrumbs';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { CategoryForm } from './CategoryForm';

type Props = {
    category_type: CategoryType;
} & BreadcrumbsProps;

const CreateCategoryDialog = createDialog(({ breadcrumbs, category_type }: Props) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const dialog = useCreateCategoryDialog();

    const { mutate: createCategory } = useCreateCategory({
        onSuccess: () => {
            handleSuccess({
                description: 'finance:categoryCreated',
            });

            dialog.hide();
            queryClient.invalidateQueries(['categories']);
        },
        onError: handleError,
    });

    const createCategoryInitialState: CategoryData = {
        name: '',
        color: 'red',
        icon: '',
        category_type: category_type,
        is_default: false,
    };

    return (
        <CategoryForm
            actionButtonLabel={t('common:create')}
            initialState={createCategoryInitialState}
            onSubmit={createCategory}
            breadcrumbs={breadcrumbs}
            category_type={category_type}
            dialog={dialog}
        />
    );
});

export const openCreateCategoryDialog = (props: Props) =>
    openDialog(CreateCategoryDialog, {
        id: 'CreateCategory',
        ...props,
    });

export const useCreateCategoryDialog = () => useDialog(CreateCategoryDialog);
