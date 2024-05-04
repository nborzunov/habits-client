import {
    Button,
    FormControl,
    FormLabel,
    Grid,
    GridItem,
    Icon,
    Input,
    theme,
} from '@chakra-ui/react';
import { CategoryData, CategoryType } from '@entities/category';
import { Icons$ } from '@shared/lib';
import { UseFormRegisterReturn, UseFormSetValue } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export const NameField = ({
    value,
    registerProps,
}: {
    value?: string;
    registerProps: UseFormRegisterReturn<'name'>;
}) => {
    const { t } = useTranslation();

    return (
        <FormControl isRequired>
            <FormLabel>{t('finance:name')}</FormLabel>

            <Input
                type={'text'}
                value={value}
                placeholder={t('finance:name') as string}
                {...registerProps}
            />
        </FormControl>
    );
};

export const IconField = ({
    value,
    color,
    category_type,
    setValue,
}: {
    value: string;
    color: string;
    category_type: CategoryType;
    setValue: UseFormSetValue<CategoryData>;
}) => {
    const { t } = useTranslation();

    const iconsComponents = Icons$.categoryIcons[category_type];

    return (
        <FormControl>
            <FormLabel>{t('finance:icon')}</FormLabel>

            <Grid templateColumns={'repeat(7, 1fr)'} gap={2}>
                {iconsComponents &&
                    Object.keys(Icons$.categoryIcons[category_type]).map((icon: any) => {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        const LucideIcon = iconsComponents[icon];
                        return (
                            <GridItem
                                key={icon}
                                onClick={() => setValue('icon', icon)}
                                bg={icon === value ? `${color}.400` : 'gray.100'}
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
                                    bg: icon === value ? `${color}.500` : 'gray.200',
                                }}
                            >
                                <Icon
                                    key={icon}
                                    size={32}
                                    as={LucideIcon}
                                    color={icon === value ? 'white' : theme.colors.gray[700]}
                                />
                            </GridItem>
                        );
                    })}
            </Grid>
        </FormControl>
    );
};

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

export const ColorField = ({
    value,
    setValue,
}: {
    value: string;
    setValue: UseFormSetValue<CategoryData>;
}) => {
    const { t } = useTranslation();

    return (
        <FormControl>
            <FormLabel>{t('finance:color')}</FormLabel>

            <Grid templateColumns={'repeat(3, 1fr)'} gap={2} w='100%'>
                {colors.map((color) => (
                    <GridItem key={color}>
                        <Button
                            onClick={() => setValue('color', color)}
                            w='100%'
                            bg={color === value ? `${color}.400` : 'gray.100'}
                            _hover={{
                                bg: color === value ? `${color}.500` : 'gray.200',
                            }}
                            color={color === value ? 'white' : `${color}.500`}
                        >
                            {t(`finance:categoryColors.${color}`)}
                        </Button>
                    </GridItem>
                ))}
            </Grid>
        </FormControl>
    );
};
