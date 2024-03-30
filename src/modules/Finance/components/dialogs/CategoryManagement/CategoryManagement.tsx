import {
    Alert,
    AlertIcon,
    Button,
    Divider,
    Flex,
    Grid,
    GridItem,
    Icon,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Stack,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Icons from '~/common/helpers/Icons';
import { useCustomScroll } from '~/common/hooks/useCustomScroll';
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

    const showChildren = true;
    const [selectedParent, setSelectedParent] = React.useState<PicklistItem<Category> | null>(null);

    useEffect(() => {
        setSelectedParent(null);
    }, [isOpen]);

    const openAddCategoryDialog = (parentId?: string) =>
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
            parentId,
        });

    const customScroll = useCustomScroll();

    return (
        <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} size={'4xl'}>
            <ModalContent mx={4} visibility={isOpenAddCategoryDialog ? 'hidden' : 'visible'}>
                <ModalHeader>{t(`finance:categoryManagement`)} </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {!items.length && (
                        <Alert status='info'>
                            <AlertIcon />
                            {t('finance:noCategoriesWarning')}
                        </Alert>
                    )}

                    <Grid
                        py={2}
                        gridTemplateColumns={showChildren ? '1fr 1px 1fr' : '1fr'}
                        gridColumnGap={1}
                    >
                        <GridItem>
                            <Stack
                                flexDirection={'column'}
                                spacing={3}
                                pr={1.5}
                                h={'307px'}
                                overflowY={'scroll'}
                                __css={customScroll}
                            >
                                {items.map((item) => (
                                    <Button
                                        minH={'40px'}
                                        key={item.id}
                                        onClick={() => {
                                            setSelectedParent(item);
                                        }}
                                        width={'100%'}
                                        justifyContent={'space-between'}
                                        rightIcon={
                                            item.children?.length ? (
                                                <Icon fontSize='lg' as={Icons.Right} />
                                            ) : undefined
                                        }
                                        colorScheme={
                                            selectedParent?.id === item.id ? 'blue' : undefined
                                        }
                                        variant={
                                            selectedParent?.id === item.id ? 'outline' : 'solid'
                                        }
                                    >
                                        {item.label}
                                    </Button>
                                ))}
                            </Stack>
                        </GridItem>

                        <GridItem>
                            <Divider orientation='vertical' w={'1px'} />
                        </GridItem>
                        <GridItem>
                            {!selectedParent && (
                                <Alert status='info'>
                                    <AlertIcon />
                                    {t('finance:selectCategoryToViewSubcategories')}
                                </Alert>
                            )}
                            {selectedParent?.children?.length === 0 && (
                                <Alert status='info'>
                                    <AlertIcon />
                                    {t('finance:selectedCategoryHasNoSubcategories')}
                                </Alert>
                            )}
                            {selectedParent?.children && selectedParent?.children?.length > 0 && (
                                <Stack spacing={3} ml={1.5}>
                                    {selectedParent.children.map((item) => (
                                        <Button
                                            key={item.id}
                                            h={'40px'}
                                            width={'100%'}
                                            textAlign={'left'}
                                            justifyContent={'space-between'}
                                            variant={'solid'}
                                        >
                                            {item.label}
                                        </Button>
                                    ))}
                                    <Button
                                        minH={'40px'}
                                        leftIcon={<Icon as={Icons.Add} />}
                                        width={'calc(50% - 10.5px)'}
                                        justifyContent={'start'}
                                        variant={'solid'}
                                    >
                                        {t('finance:add')}
                                    </Button>
                                </Stack>
                            )}
                        </GridItem>
                    </Grid>
                </ModalBody>

                <ModalFooter pt={0}>
                    <Flex width={'100%'} justifyContent={'space-between'}>
                        <Button
                            minH={'40px'}
                            leftIcon={<Icon as={Icons.Add} />}
                            width={'calc(50% - 10.5px)'}
                            justifyContent={'start'}
                            variant={'solid'}
                            onClick={() => openAddCategoryDialog()}
                        >
                            {t('finance:add')}
                        </Button>
                        <Button
                            minH={'40px'}
                            leftIcon={<Icon as={Icons.Add} />}
                            width={'calc(50% - 10.5px)'}
                            justifyContent={'start'}
                            variant={'solid'}
                            onClick={() => openAddCategoryDialog(selectedParent?.id)}
                        >
                            {t('finance:add')}
                        </Button>
                    </Flex>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export const {
    DialogProvider: CategoryManagementDialogProvider,
    useDialogAction: useCategoryManagementDialog,
} = createDialogProvider<CategoryManagementProps>(CategoryManagement);
