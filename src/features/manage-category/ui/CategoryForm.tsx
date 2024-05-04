import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Stack,
} from '@chakra-ui/react';
import { CategoryData, CategoryType } from '@entities/category';
import { Dialog } from '@shared/hooks';
import { Breadcrumbs, BreadcrumbsProps } from '@shared/ui/Breadcrumbs';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ColorField, IconField, NameField } from './Fields';

export const CategoryForm = ({
    dialog,
    initialState,
    actionButtonLabel,
    breadcrumbs,
    category_type,
    onSubmit,
}: {
    actionButtonLabel: string;
    initialState: CategoryData;
    dialog: Dialog;
    category_type: CategoryType;
    onSubmit: (data: CategoryData) => void;
} & BreadcrumbsProps) => {
    const { t } = useTranslation();

    const {
        register,
        formState: { isSubmitting },
        handleSubmit,
        setValue,
        watch,
    } = useForm({
        mode: 'all',
        defaultValues: initialState,
    });

    const onFormSubmit = (data: CategoryData) => {
        onSubmit(data);
    };

    const [form, setForm] = useState(initialState);

    useEffect(() => {
        const subscription = watch((value) => setForm(value as any));
        return () => subscription.unsubscribe();
    }, [watch]);

    useEffect(() => {
        setForm(initialState);
        setValue('name', initialState.name);
        setValue('icon', initialState.icon);
        setValue('color', initialState.color);
        setValue('category_type', initialState.category_type);
        setValue('is_default', initialState.is_default);
    }, [initialState, setValue]);
    return (
        <Modal isOpen={dialog.visible} onClose={dialog.hide} closeOnOverlayClick={false}>
            <ModalContent mx={4} as={'form'} onSubmit={handleSubmit(onFormSubmit)}>
                <ModalHeader>
                    <Breadcrumbs items={breadcrumbs} />
                </ModalHeader>

                <ModalCloseButton />

                <ModalBody as={Stack} spacing={3}>
                    <NameField value={form.name} registerProps={register('name')} />

                    <IconField
                        value={form.icon}
                        color={form.color}
                        category_type={category_type}
                        setValue={setValue}
                    />

                    <ColorField value={form.color} setValue={setValue} />
                </ModalBody>

                <ModalFooter display={'flex'} justifyContent={'end'} columnGap={3}>
                    <Button colorScheme='blue' size={'md'} onClick={dialog.hide}>
                        {t('common:close')}
                    </Button>
                    <Button colorScheme='green' type='submit' size={'md'} isLoading={isSubmitting}>
                        {actionButtonLabel}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
