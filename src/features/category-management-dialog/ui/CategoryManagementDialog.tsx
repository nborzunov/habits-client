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
    Stack,
} from '@chakra-ui/react';
import { CategoryType, useCategoriesByType } from '@entities/category';
import { useDeleteCategory } from '@entities/category/api/useDeleteCategory';
import { getCategoryIconsMap } from '@entities/finance/lib/helpers';
import { useAddCategoryDialog } from '@features/add-category-dialog';
import { createDialog, openDialog, useDialog } from '@shared/hooks';
import { openConfirmationDialog } from '@shared/ui/ConfirmationDialog';
import { ListItem } from '@shared/ui/ListItem';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    mode: CategoryType;
}

const CategoryManagementDialog = createDialog(({ mode }: Props) => {
    const { t } = useTranslation();
    const categories = useCategoriesByType(mode as unknown as CategoryType);
    const dialog = useCategoryManagementDialog();
    const addCategoryDialog = useAddCategoryDialog();

    const openAddCategoryDialog = () =>
        addCategoryDialog.show({
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

    const { mutate: deleteCategory } = useDeleteCategory();

    const onDelete = (category_id: string) => {
        openConfirmationDialog({
            title: t('common:delete'),
            text: t('finance:confirmCategoryDelete'),
            cancelText: t('common:cancel'),
            okText: t('common:delete'),
        })
            .then(() => deleteCategory(category_id))
            .catch(() => {});
    };

    return (
        <Modal isOpen={dialog.visible} onClose={dialog.hide} closeOnOverlayClick={false}>
            <ModalContent mx={4} visibility={addCategoryDialog.visible ? 'hidden' : 'visible'}>
                <ModalHeader>{t(`finance:categories.categoryManagement`)}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {!categories.length && (
                        <Alert status='info'>
                            <AlertIcon />
                            {t('finance:categories.noCategoriesWarning')}
                        </Alert>
                    )}

                    <Stack spacing={3} mt={3}>
                        {categories.map(({ value: category }) => {
                            const categoryIconsMap = getCategoryIconsMap(category.category_type);
                            return (
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
                                    onDelete={() => onDelete(category.id)}
                                />
                            );
                        })}
                    </Stack>
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
                            onClick={() => openAddCategoryDialog()}
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
