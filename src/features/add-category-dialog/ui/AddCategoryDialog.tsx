import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Grid,
    GridItem,
    Icon,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Stack,
    theme,
} from '@chakra-ui/react';
import { useCreateCategory } from '@entities/category';
import { CategoryType } from '@entities/category';
import { createDialog, openDialog, useDialog } from '@shared/hooks';
import { Icons$, handleError, handleSuccess } from '@shared/lib';
import { Breadcrumbs, BreadcrumbsProps } from '@shared/ui/Breadcrumbs';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const colors = [
    'red',
    'orange',
    'yellow',
    'green',
    'teal',
    'blue',
    'cyan',
    'purple',
    'pink',
] as const;
type SelectedColor = (typeof colors)[number];
type SelectedIcon =
    | keyof typeof Icons$.categoryIcons.expense
    | keyof typeof Icons$.categoryIcons.income
    | null;

interface FormData {
    name: string;
    color: SelectedColor;
    icon: SelectedIcon;
}

type Props = {
    category_type: CategoryType;
} & BreadcrumbsProps;

const AddCategoryDialog = createDialog(({ breadcrumbs, category_type }: Props) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const dialog = useAddCategoryDialog();

    const { mutate: createCategory } = useCreateCategory({
        onSuccess: () => {
            handleSuccess({
                description: 'finance:categoryCreated',
            });

            dialog.hide();
            queryClient.invalidateQueries(['categories']);
        },
        onError: handleError,
    });

    const defaultState: FormData = {
        name: '',
        color: 'red',
        icon: null,
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
        createCategory({
            ...data,
            category_type: category_type,
            is_default: false,
        });
    };

    const [form, setForm] = useState(defaultState);

    useEffect(() => {
        const subscription = watch((value) => setForm(value as any));
        return () => subscription.unsubscribe();
    }, [watch]);

    useEffect(() => {
        setValue('name', '');
    }, [dialog.visible, setValue]);

    const iconsComponents = Icons$.categoryIcons[category_type];

    return (
        <Modal isOpen={dialog.visible} onClose={dialog.hide} closeOnOverlayClick={false}>
            <ModalContent mx={4} as={'form'} onSubmit={handleSubmit(onFormSubmit)}>
                <ModalHeader>
                    <Breadcrumbs items={breadcrumbs} />
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Stack spacing={3}>
                        <FormControl>
                            <FormLabel>{t('finance:name')}</FormLabel>

                            <Input
                                type={'text'}
                                value={form.name}
                                placeholder={t('finance:name') as string}
                                {...register('name')}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel>{t('finance:icon')}</FormLabel>

                            <Grid templateColumns={'repeat(7, 1fr)'} gap={2}>
                                {iconsComponents &&
                                    Object.keys(Icons$.categoryIcons[category_type]).map(
                                        (icon: any) => {
                                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                            // @ts-ignore
                                            const LucideIcon = iconsComponents[icon];
                                            return (
                                                <GridItem
                                                    key={icon}
                                                    onClick={() => setValue('icon', icon)}
                                                    bg={
                                                        icon === form.icon
                                                            ? `${form.color}.400`
                                                            : 'gray.100'
                                                    }
                                                    p={2}
                                                    display='flex'
                                                    justifyContent={'center'}
                                                    alignItems={'center'}
                                                    rounded={'xl'}
                                                    border={'1px solid'}
                                                    borderColor={'gray.200'}
                                                    cursor='pointer'
                                                    transition='background-color .2s, color .2s'
                                                    dropShadow={'lg'}
                                                    _hover={{
                                                        bg:
                                                            icon === form.icon
                                                                ? `${form.color}.500`
                                                                : 'gray.200',
                                                    }}
                                                >
                                                    <Icon
                                                        key={icon}
                                                        size={32}
                                                        as={LucideIcon}
                                                        color={
                                                            icon === form.icon
                                                                ? 'white'
                                                                : theme.colors.gray[700]
                                                        }
                                                    />
                                                </GridItem>
                                            );
                                        },
                                    )}
                            </Grid>
                        </FormControl>

                        <FormControl>
                            <FormLabel>{t('finance:color')}</FormLabel>

                            <Grid templateColumns={'repeat(3, 1fr)'} gap={2} w='100%'>
                                {colors.map((color) => (
                                    <GridItem key={color}>
                                        <Button
                                            onClick={() => setValue('color', color)}
                                            w='100%'
                                            bg={color === form.color ? `${color}.400` : 'gray.100'}
                                            _hover={{
                                                bg:
                                                    color === form.color
                                                        ? `${color}.500`
                                                        : 'gray.200',
                                            }}
                                            color={color === form.color ? 'white' : `${color}.500`}
                                        >
                                            {t(`finance:categoryColors.${color}`)}
                                        </Button>
                                    </GridItem>
                                ))}
                            </Grid>
                        </FormControl>
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
                            isLoading={isSubmitting}
                        >
                            {t('finance:create')}
                        </Button>
                    </Box>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
});

export const openAddCategoryDialog = (props: Props) =>
    openDialog(AddCategoryDialog, {
        id: 'AddCategory',
        ...props,
    });

export const useAddCategoryDialog = () => useDialog(AddCategoryDialog);
