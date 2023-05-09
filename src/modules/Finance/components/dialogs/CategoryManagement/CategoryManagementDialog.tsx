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
import React from 'react';
import { useTranslation } from 'react-i18next';
import Icons from '~/common/helpers/Icons';
import { useDialog } from '~/common/hooks/useDialog';
import { Category, DialogTypes, PicklistItem } from '~/modules/Finance/types';

export const CategoryManagementDialog = ({
    isOpen,
    onClose,
    items = [],
}: {
    isOpen: boolean;
    onClose: () => void;
    items: PicklistItem<Category>[];
}) => {
    const { t } = useTranslation();

    const {
        isOpen: isOpenAddCategoryDialog,
        // onOpen: onOpenAddCategoryDialog,
        // onClose: onCloseAddCategoryDialog,
    } = useDialog(DialogTypes.AddCategoryDialog);

    const showChildren = true;
    const [selectedParent, setSelectedParent] = React.useState<PicklistItem<Category> | null>(null);

    return (
        <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} size={'3xl'}>
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
                            >
                                {items.map((item) => (
                                    <Button
                                        minH={'40px'}
                                        key={item.id}
                                        onClick={() => {
                                            if (item.children?.length) {
                                                setSelectedParent(item);
                                                return;
                                            }
                                        }}
                                        width={'100%'}
                                        justifyContent={'space-between'}
                                        rightIcon={
                                            item.children?.length ? (
                                                <Icon fontSize='lg' as={Icons.Right} />
                                            ) : undefined
                                        }
                                        variant={'solid'}
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
                                    {t('finance:selectCategoryToViewChildren')}
                                </Alert>
                            )}
                            {selectedParent?.children?.length === 0 && (
                                <Alert status='info'>
                                    <AlertIcon />
                                    {t('finance:selectedCategoryHasNoChildren')}
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

                    {/*    TODO: add category*/}
                </ModalBody>

                <ModalFooter pt={0}>
                    <Flex width={'100%'}>
                        <Button
                            minH={'40px'}
                            leftIcon={<Icon as={Icons.Add} />}
                            width={'calc(50% - 10.5px)'}
                            justifyContent={'start'}
                            variant={'solid'}
                        >
                            {t('finance:add')}
                        </Button>
                    </Flex>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
