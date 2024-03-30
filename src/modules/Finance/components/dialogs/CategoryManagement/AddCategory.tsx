import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Stack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Breadcrumbs, BreadcrumbsProps } from '~/common/components/Breadcrumbs';
import { DialogProps } from '~/common/hooks/useDIalog.types';
import { createDialogProvider } from '~/common/hooks/useDialog';
import { useCreateCategory } from '~/modules/Finance/api/categories/useCreateCategory';
import { CategoryType } from '~/modules/Finance/types';

interface FormData {
    name: string;
}

type AddCategoryProps = {
    parentId?: string;
    categoryType: CategoryType;
} & BreadcrumbsProps;

const AddCategory = ({
    isOpen,
    onClose,
    breadcrumbs,
    parentId,
    categoryType,
}: DialogProps<AddCategoryProps>) => {
    const { t } = useTranslation();

    const { mutate } = useCreateCategory(() => {
        onClose();
    });

    const defaultState: FormData = {
        name: '',
    };
    const {
        register,
        formState: { isSubmitting },
        handleSubmit,
        watch,
        setValue,
    } = useForm({
        mode: 'all',
        defaultValues: defaultState,
    });

    const onFormSubmit = (data: FormData) => {
        mutate({
            ...data,
            categoryType: categoryType,
            parentId: parentId,
            default: false,
        });
    };

    const [form, setForm] = useState(defaultState);

    useEffect(() => {
        const subscription = watch((value) => setForm(value as any));
        return () => subscription.unsubscribe();
    }, [watch]);

    useEffect(() => {
        setValue('name', '');
    }, [isOpen, setValue]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
            <ModalContent mx={4} as={'form'} onSubmit={handleSubmit(onFormSubmit)}>
                <ModalHeader>
                    <Breadcrumbs items={breadcrumbs} />
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Stack spacing={3}>
                        <FormControl isRequired>
                            <FormLabel>{t('finance:name')}</FormLabel>

                            <Input
                                type={'text'}
                                value={form.name}
                                placeholder={t('finance:name') as string}
                                {...register('name')}
                            />
                        </FormControl>
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
                            isLoading={isSubmitting}
                        >
                            {t('finance:create')}
                        </Button>
                    </Box>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export const { DialogProvider: AddCategoryDialogProvider, useDialogAction: useAddCategoryDialog } =
    createDialogProvider<AddCategoryProps>(AddCategory);
