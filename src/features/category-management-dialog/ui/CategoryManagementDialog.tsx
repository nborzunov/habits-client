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
import { Category, CategoryType } from '@entities/category';
import { getCategoryIconsMap } from '@entities/finance/lib/helpers';
import { useAddCategoryDialog } from '@features/add-category-dialog';
import { DialogProps, createDialogProvider } from '@shared/hooks';
import { PicklistItem } from '@shared/model/types';
import { ListItem } from '@shared/ui/ListItem';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface CategoryManagementProps {
    categories: PicklistItem<Category>[];
    mode: CategoryType;
}

const CategoryManagement = ({
    isOpen,
    onClose,
    categories = [],
    mode,
}: DialogProps<CategoryManagementProps>) => {
    const { t } = useTranslation();

    const {
        isOpen: isOpenAddCategoryDialog,
        onOpen: onOpenAddCategoryDialog,
        onClose: onCloseAddCategoryDialog,
    } = useAddCategoryDialog();

    const openAddCategoryDialog = () =>
        onOpenAddCategoryDialog({
            breadcrumbs: [
                {
                    label: t('finance:addTransaction'),
                    onClick: onCloseAddCategoryDialog,
                },
                {
                    label: t(`finance:newCategory`),
                },
            ],
            categoryType: mode as unknown as CategoryType,
        });

    return (
        <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
            <ModalContent mx={4} visibility={isOpenAddCategoryDialog ? 'hidden' : 'visible'}>
                <ModalHeader>{t(`finance:categoryManagement`)}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {!categories.length && (
                        <Alert status='info'>
                            <AlertIcon />
                            {t('finance:noCategoriesWarning')}
                        </Alert>
                    )}

                    <Stack spacing={3} mt={3}>
                        {categories.map(({ value: category }) => {
                            const categoryIconsMap = getCategoryIconsMap(category.categoryType);
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
                                    onDelete={async () => alert('TODO')}
                                    onEdit={async () => alert('TODO')}
                                />
                            );
                        })}
                    </Stack>
                </ModalBody>

                <ModalFooter>
                    <Box display={'flex'} justifyContent={'end'}>
                        <Button colorScheme='blue' mr={3} size={'md'} onClick={onClose}>
                            {t('common:close')}
                        </Button>
                        <Button
                            colorScheme='green'
                            type='submit'
                            size={'md'}
                            onClick={() => openAddCategoryDialog()}
                        >
                            {t('finance:newCategory')}
                        </Button>
                    </Box>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export const {
    DialogProvider: CategoryManagementDialogProvider,
    useDialogAction: useCategoryManagementDialog,
} = createDialogProvider<CategoryManagementProps>(CategoryManagement);
