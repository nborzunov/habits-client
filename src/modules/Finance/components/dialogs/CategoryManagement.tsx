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
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DialogProps } from '~/common/hooks/useDIalog.types';
import { createDialogProvider } from '~/common/hooks/useDialog';
import { useAddCategoryDialog } from '~/modules/Finance/components/dialogs/AddCategory';
import { getCategoryIconsMap } from '~/modules/Finance/helpers';
import { Category, CategoryType, PicklistItem } from '~/modules/Finance/types';

import { ListItem } from '../ListItem';

export interface CategoryManagementProps {
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
                                    icon={categoryIconsMap[category.icon]}
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
