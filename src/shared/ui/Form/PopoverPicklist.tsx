import {
    Box,
    Button,
    Flex,
    Grid,
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

import { ErrorWrapper } from './ErrorWrapper';

export const PopoverPicklist = <T extends string>({
    dialogRef,
    items,
    button,
    item,
    error,
}: {
    dialogRef: any;
    items: Array<T>;
    button: React.ReactNode;
    item: (item: T) => React.ReactNode;
    error?: any;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <Popover placement='bottom-end' isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
            <PopoverTrigger>
                <Flex>
                    <ErrorWrapper error={error} placement='bottom-end' hide={isOpen}>
                        <Box>{button}</Box>
                    </ErrorWrapper>
                </Flex>
            </PopoverTrigger>

            <Portal containerRef={dialogRef}>
                <PopoverContent mt={2}>
                    <PopoverArrow />
                    <PopoverBody>
                        <Grid templateColumns={`repeat(6, 1fr)`} gap={2}>
                            {items.map((color: any) => (
                                <Box
                                    key={color}
                                    onClick={() => {
                                        setTimeout(() => onClose(), 150);
                                    }}
                                >
                                    {item(color)}
                                </Box>
                            ))}
                        </Grid>
                    </PopoverBody>
                </PopoverContent>
            </Portal>
        </Popover>
    );
};

type PopoverPicklistItemProps = {
    value: string;
    children: React.ReactNode;
    tooltipText?: string;
    selectedValue?: string;
    color?: string;
    preview?: boolean;
    light?: boolean;
    onClick?: (item: string) => void;
};
const PopoverPicklistItem = ({
    value,
    children,
    tooltipText,
    selectedValue,
    color,
    preview = false,
    light = false,
    onClick,
}: PopoverPicklistItemProps) => {
    const selected = selectedValue === value;
    const bgColor = color || value;
    return (
        <Tooltip label={tooltipText} openDelay={500} isDisabled={preview || !tooltipText}>
            <Button
                variant={preview ? 'outline' : 'ghost'}
                colorScheme={bgColor}
                onClick={() => onClick && onClick(value)}
                minWidth={preview ? '32px' : '40px'}
                minHeight={preview ? '32px' : '40px'}
                maxWidth={preview ? '32px' : '40px'}
                maxHeight={preview ? '32px' : '40px'}
                rounded={preview ? 'xl' : 'xl'}
                border='none'
                bg={preview || selected ? `${bgColor}.${light ? '50' : '100'}` : `${bgColor}.50`}
                _hover={{
                    bg:
                        preview || selected
                            ? `${bgColor}.${light ? '100' : '200'}`
                            : `${bgColor}.100`,
                }}
                cursor={'pointer'}
                px={0}
                boxSizing='border-box'
            >
                {children}
            </Button>
        </Tooltip>
    );
};

PopoverPicklist.Button = (
    props: Pick<PopoverPicklistItemProps, 'value' | 'color' | 'light' | 'children' | 'tooltipText'>,
) => <PopoverPicklistItem {...props} preview={true} />;
PopoverPicklist.Item = PopoverPicklistItem;
