import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Icon,
    Input,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Stack,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import { Icons$ } from '@shared/lib';
import { PicklistItem } from '@shared/model/types';
import { useTranslation } from 'react-i18next';

export const SelectFromPicklist = <
    T extends {
        id: string;
        name: string;
    },
>({
    name,
    title,
    items,
    value,
    onChange,
    noItemsWarning,
    editButton,
    addItem,
    renderItem,
}: {
    name: string;
    title: string;
    items: PicklistItem<T>[];
    value?: T;
    onChange: (value: T) => void;
    // TODO: fix any
    noItemsWarning?: any;
    editButton?: any;
    addItem?: any;
    renderItem: (value: T) => JSX.Element | string;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { t } = useTranslation();

    const handleClose = (callback?: () => void) => {
        if (callback) {
            callback();
        }

        onClose();
    };

    return (
        <FormControl isRequired>
            <FormLabel>{name}</FormLabel>
            <Popover isOpen={isOpen} onClose={handleClose} matchWidth>
                <PopoverTrigger>
                    <Input
                        value={value?.name || ''}
                        onChange={() => ''}
                        placeholder={name}
                        onClick={onOpen}
                    />
                </PopoverTrigger>
                <PopoverContent width={'100%'}>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <Box position={'absolute'} top={0.5} right={9}>
                        {editButton}
                    </Box>
                    <PopoverHeader borderBottom={'none'} fontSize={'lg'} fontWeight={'semibold'}>
                        <Text> {title}</Text>
                    </PopoverHeader>
                    <PopoverBody
                        width={'100%'}
                        boxShadow={'lg'}
                        as={Flex}
                        direction={'column'}
                        justify={'space-between'}
                    >
                        {!items.length && noItemsWarning}
                        <Stack spacing={2} height={'350px'} overflowY={'auto'}>
                            {items.map((item) => (
                                <Button
                                    key={item.id}
                                    onClick={() => {
                                        onChange(item.value);
                                        handleClose();
                                    }}
                                    width={'100%'}
                                    height={'36px'}
                                    display='block'
                                    colorScheme={value?.id === item.id ? 'blue' : undefined}
                                    variant={value?.id === item.id ? 'outline' : 'solid'}
                                >
                                    {renderItem(item.value)}
                                </Button>
                            ))}
                        </Stack>
                        {addItem && (
                            <Button
                                mt={2}
                                leftIcon={<Icon as={Icons$.Add} />}
                                onClick={() => {
                                    addItem();
                                }}
                                width={'100%'}
                                variant={'solid'}
                            >
                                {t('finance:add')}
                            </Button>
                        )}
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </FormControl>
    );
};
