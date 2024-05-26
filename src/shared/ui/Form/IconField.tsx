import {
    Center,
    Flex,
    FormControl,
    FormLabel,
    Grid,
    GridItem,
    Icon,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Portal,
    Tooltip,
    theme,
    useDisclosure,
} from '@chakra-ui/react';
import { ImagePlus, LucideIcon } from 'lucide-react';
import { UseFormSetValue } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export const IconField = ({
    value,
    color,
    icons,
    setValue,
    type = 'default',
    dialogRef,
}: {
    value: string;
    color: string;
    icons: Record<string, LucideIcon>;
    setValue: UseFormSetValue<any>;
    type?: 'default' | 'button';
    dialogRef: any;
}) => {
    const { t } = useTranslation();

    const { isOpen, onOpen, onClose } = useDisclosure();

    if (type === 'default') {
        return (
            <FormControl>
                <FormLabel>{t('common:icon')}</FormLabel>

                <IconsGrid
                    icons={icons}
                    value={value}
                    color={color}
                    onClick={(iconId) => setValue('icon', iconId)}
                />
            </FormControl>
        );
    }

    return (
        <Popover placement='bottom-end' isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
            <PopoverTrigger>
                <Flex>
                    <Tooltip label={t('common:selectIconMessage')} openDelay={500}>
                        <Flex>
                            <IconsGridItem
                                value={value}
                                iconId={value}
                                icon={icons[value] || ImagePlus}
                                color={color}
                                preview={true}
                                onClick={() => {}}
                            />
                        </Flex>
                    </Tooltip>
                </Flex>
            </PopoverTrigger>

            <Portal containerRef={dialogRef}>
                <PopoverContent visibility={isOpen ? 'visible' : 'hidden'}>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>{t('common:selectIcon')}</PopoverHeader>
                    <PopoverBody>
                        <IconsGrid
                            icons={icons}
                            value={value}
                            color={color}
                            size={6}
                            onClick={(iconId) => {
                                setValue('icon', iconId);
                                setTimeout(() => onClose(), 300);
                            }}
                        />
                    </PopoverBody>
                </PopoverContent>
            </Portal>
        </Popover>
    );
};

const IconsGrid = ({
    icons,
    value,
    color,
    onClick,
    size = 7,
}: {
    icons: Record<string, LucideIcon>;
    value: string;
    color: string;
    onClick: (iconId: string) => void;
    size?: number;
}) => {
    return (
        <Grid templateColumns={`repeat(${size}, 1fr)`} gap={2}>
            {Object.keys(icons).map((icon: any) => (
                <IconsGridItem
                    as={GridItem}
                    key={icon}
                    value={value}
                    iconId={icon}
                    icon={icons[icon]}
                    color={color}
                    onClick={onClick}
                />
            ))}
        </Grid>
    );
};

const IconsGridItem = ({
    value,
    iconId,
    icon,
    color,
    onClick,
    preview,
    as,
}: {
    value: string;
    iconId: string;
    icon: LucideIcon;
    color: string;
    onClick: (iconId: string) => void;
    preview?: boolean;
    as?: any;
}) => {
    const selected = iconId === value;

    return (
        <Center>
            <Center
                as={as}
                bg={selected ? `${color}.300` : 'gray.100'}
                maxWidth={preview ? '40px' : '40px'}
                maxHeight={preview ? '32px' : '40px'}
                rounded={preview ? 'lg' : 'xl'}
                border={'1px solid'}
                borderColor={'gray.200'}
                cursor='pointer'
                dropShadow={'lg'}
                py={2}
                px={4}
                transition='background-color .2s, color .2s'
                _hover={{
                    bg: selected ? `${color}.400` : 'gray.200',
                }}
                onClick={() => onClick(iconId)}
            >
                <Icon
                    key={iconId}
                    as={icon}
                    fontSize='lg'
                    strokeWidth={2}
                    color={selected ? 'white' : theme.colors.gray[700]}
                />
            </Center>
        </Center>
    );
};
