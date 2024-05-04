import { Category, useEditCategory } from '@entities/category';
import { createDialog, openDialog, useDialog } from '@shared/hooks';
import { handleError, handleSuccess } from '@shared/lib';
import { BreadcrumbsProps } from '@shared/ui/Breadcrumbs';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { CategoryForm } from './CategoryForm';

type Props = {
    category: Category;
} & BreadcrumbsProps;

const EditCategoryDialog = createDialog(({ category, breadcrumbs }: Props) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const dialog = useEditCategoryDialog();

    const { mutate: updateCategory } = useEditCategory({
        onSuccess: () => {
            dialog.hide();
            queryClient.invalidateQueries(['categories']);

            handleSuccess({
                description: 'finance:categoryUpdated',
            });
        },
        onError: handleError,
    });

    return (
        <CategoryForm
            actionButtonLabel={t('common:update')}
            initialState={category}
            onSubmit={(data) => updateCategory({ category_id: category.id, data })}
            breadcrumbs={breadcrumbs}
            dialog={dialog}
            category_type={category.category_type}
        />
    );
});

export const openEditCategoryDialog = (props: Props) =>
    openDialog(EditCategoryDialog, {
        id: 'EditCategory',
        ...props,
    });

export const useEditCategoryDialog = () => useDialog(EditCategoryDialog);
