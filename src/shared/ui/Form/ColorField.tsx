import {
    Box,
    Button,
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
    useDisclosure,
} from '@chakra-ui/react';
import { PaintBucket } from 'lucide-react';
import { UseFormSetValue } from 'react-hook-form';
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
    'gray',
] as const;

export const ColorField = ({
    value,
    setValue,
    type = 'default',
    dialogRef,
}: {
    value: string;
    setValue: UseFormSetValue<any>;
    type?: 'default' | 'button';
    dialogRef: any;
}) => {
    const { t } = useTranslation();

    const { isOpen, onOpen, onClose } = useDisclosure();

    if (type === 'default') {
        return (
            <FormControl>
                <FormLabel>{t('common:color')}</FormLabel>

                <ColorsGrid value={value} onClick={(colorId) => setValue('color', colorId)} />
            </FormControl>
        );
    }

    return (
        <Popover placement='bottom-end' isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
            <PopoverTrigger>
                <Flex>
                    <Tooltip label={t('common:selectColorMessage')} openDelay={500}>
                        <Flex>
                            <ColorsGridItem
                                value={value}
                                colorId={value}
                                preview={true}
                                onClick={() => {}}
                            >
                                <Icon as={PaintBucket} strokeWidth={2} />
                            </ColorsGridItem>
                        </Flex>
                    </Tooltip>
                </Flex>
            </PopoverTrigger>

            <Portal containerRef={dialogRef}>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>{t('common:selectColor')}</PopoverHeader>
                    <PopoverBody>
                        <ColorsGrid
                            value={value}
                            size={6}
                            onClick={(colorId) => {
                                setValue('color', colorId);
                                setTimeout(() => onClose(), 300);
                            }}
                        />
                    </PopoverBody>
                </PopoverContent>
            </Portal>
        </Popover>
    );
};

const ColorsGrid = ({
    value,
    onClick,
    size = 5,
}: {
    value: string;
    onClick: (colorId: string) => void;
    size?: number;
}) => {
    return (
        <Grid templateColumns={`repeat(${size}, 1fr)`} gap={2}>
            {colors.map((color: any) => (
                <ColorsGridItem
                    as={GridItem}
                    key={color}
                    value={value}
                    colorId={color}
                    onClick={onClick}
                />
            ))}
        </Grid>
    );
};

const ColorsGridItem = ({
    value,
    colorId,
    onClick,
    preview,
    as,
    children: customIcon,
}: {
    value: string;
    colorId: string;
    onClick: (colorId: string) => void;
    preview?: boolean;
    as?: any;
    children?: any;
}) => {
    const { t } = useTranslation();
    const selected = colorId === value;
    return (
        <Center>
            <Tooltip label={t(`common:colors.${colorId}`)} openDelay={500} isDisabled={preview}>
                <Button
                    variant={preview ? 'outline' : 'ghost'}
                    colorScheme={colorId}
                    onClick={() => onClick(colorId)}
                    maxWidth={preview ? '32px' : '40px'}
                    maxHeight={preview ? '32px' : '40px'}
                    rounded={preview ? 'lg' : 'xl'}
                    border='none'
                    bg={preview || selected ? `${colorId}.100` : `${colorId}.50`}
                    _hover={{ bg: preview || selected ? `${colorId}.200` : `${colorId}.100` }}
                    cursor={'pointer'}
                    px={0}
                    boxSizing='border-box'
                    as={as}
                >
                    {customIcon ? (
                        customIcon
                    ) : (
                        <Box
                            w={preview ? '14px' : '12px'}
                            h={preview ? '14px' : '12px'}
                            bg={`${colorId}.400`}
                            borderRadius='full'
                        ></Box>
                    )}
                </Button>
            </Tooltip>
        </Center>
    );
};
