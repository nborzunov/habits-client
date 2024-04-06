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
import { useAddCategoryDialog } from '~/modules/Finance/components/dialogs/CategoryManagement/AddCategory';
import { Category, CategoryType, PicklistItem } from '~/modules/Finance/types';

export interface CategoryManagementProps {
    items: PicklistItem<Category>[];
    mode: CategoryType;
}

const CategoryManagement = ({
    isOpen,
    onClose,
    items = [],
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
                    {!items.length && (
                        <Alert status='info'>
                            <AlertIcon />
                            {t('finance:noCategoriesWarning')}
                        </Alert>
                    )}

                    <Stack spacing={3} mt={3}>
                        {items.map((item) => (
                            <Button
                                minH={'40px'}
                                key={item.id}
                                width={'100%'}
                                justifyContent={'space-between'}
                            >
                                {item.label}
                            </Button>
                        ))}
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
