import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from '@chakra-ui/react';
import {
    Category,
    CategoryType,
    useCategories,
    useDeleteCategory,
    useReorderCategories,
} from '@entities/category';
import { openAddCategoryDialog, useAddCategoryDialog } from '@features/add-category-dialog';
import { createDialog, openDialog, useDialog } from '@shared/hooks';
import { Icons$, handleError, handleSuccess } from '@shared/lib';
import { openConfirmationDialog } from '@shared/ui/ConfirmationDialog';
import { ListItem } from '@shared/ui/ListItem';
import { SortableList } from '@shared/ui/SortableList';
import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    mode: CategoryType;
}

const CategoryManagementDialog = createDialog(({ mode }: Props) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const dialog = useCategoryManagementDialog();
    const addCategoryDialog = useAddCategoryDialog();

    const [prevCategories, setPrevCategories] = useState<Category[]>([]);

    const { data: categories = [], refetch: refetchCategories } = useCategories({
        select: (data) => (prevCategories.length > 0 ? prevCategories : data[mode]),
        onSuccess: () => {
            setPrevCategories([]);
        },
    });

    const { mutate: reorderAccounts } = useReorderCategories({
        onSuccess: () => refetchCategories(),
        onError: handleError,
    });

    const onDrag = (items: Category[]) => {
        setPrevCategories(items);

        const itemsToUpdate = items
            .map((item, index) => ({ ...item, c_order: index }))
            .filter((item, index) => item.id !== categories[index].id)
            .map(({ id, c_order }) => ({ id: id, c_order: c_order }));

        reorderAccounts(itemsToUpdate);
    };

    const onCreate = () => {
        openAddCategoryDialog({
            breadcrumbs: [
                {
                    label: t('finance:addTransaction'),
                    onClick: addCategoryDialog.hide,
                },
                {
                    label: t(`finance:categories.newCategory`),
                },
            ],
            category_type: mode as unknown as CategoryType,
        });
    };

    const { mutate: deleteCategory } = useDeleteCategory({
        onSuccess: () => {
            queryClient.invalidateQueries(['categories']);
            queryClient.invalidateQueries(['transactions']);

            handleSuccess({
                description: 'finance:categoryDeleted',
            });
        },
        onError: handleError,
    });

    const onDelete = (category: Category) => {
        openConfirmationDialog({
            title: t('finance:deleteCategory', { category_name: category.name }),
            // TODO: show amount of transactions that will be deleted
            text: t('finance:deleteCategoryWarning'),
            okText: t('common:delete'),
            cancelText: t('common:cancel'),
        })
            .then(() => deleteCategory(category.id))
            .catch(() => {});
    };

    return (
        <Modal isOpen={dialog.visible} onClose={dialog.hide} closeOnOverlayClick={false}>
            <ModalContent mx={4} visibility={addCategoryDialog.visible ? 'hidden' : 'visible'}>
                <ModalHeader>{t(`finance:categories.categoryManagement`)}</ModalHeader>
                <ModalCloseButton />
                <ModalBody mt={3}>
                    {!categories.length && (
                        <Alert status='info'>
                            <AlertIcon />
                            {t('finance:categories.noCategoriesWarning')}
                        </Alert>
                    )}

                    <SortableList
                        items={categories}
                        onChange={onDrag}
                        renderItem={(category) => {
                            const categoryIconsMap = Icons$.categoryIcons[category.category_type];

                            return (
                                <SortableList.Item id={category.id}>
                                    <ListItem
                                        id={category.id}
                                        key={category.id}
                                        color={category.color}
                                        icon={
                                            categoryIconsMap[
                                                category.icon as keyof typeof categoryIconsMap
                                            ]
                                        }
                                        label={category.name}
                                        onEdit={() => alert('TODO')}
                                        onDelete={() => onDelete(category)}
                                    />
                                    <SortableList.DragHandle />
                                </SortableList.Item>
                            );
                        }}
                    />
                </ModalBody>

                <ModalFooter>
                    <Box display={'flex'} justifyContent={'end'}>
                        <Button colorScheme='blue' mr={3} size={'md'} onClick={dialog.hide}>
                            {t('common:close')}
                        </Button>
                        <Button
                            colorScheme='green'
                            type='submit'
                            size={'md'}
                            onClick={() => onCreate()}
                        >
                            {t('finance:categories.newCategory')}
                        </Button>
                    </Box>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
});

export const openCategoryManagementDialog = (props: Props) =>
    openDialog(CategoryManagementDialog, {
        id: 'CategoryManagement',
        ...props,
    });

export const useCategoryManagementDialog = () => useDialog(CategoryManagementDialog);
