import {
    Box,
    Button,
    Divider,
    FormControl,
    FormLabel,
    Grid,
    GridItem,
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
import React from 'react';
import { useTranslation } from 'react-i18next';
import Icons from '~/common/helpers/Icons';
import { PicklistItem } from '~/modules/Finance/types';

export const SelectFromPicklistField = <
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
    hasChildren,
    noItemsWarning,
    editButton,
    addItem,
}: {
    name: string;
    title: string;
    items: PicklistItem<T>[];
    value: T | undefined;
    onChange: (value: T) => void;
    hasChildren?: boolean;
    // TODO: fix any
    noItemsWarning?: any;
    editButton?: any;
    addItem?: any;
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
        <Box>
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
                        <PopoverHeader
                            borderBottom={'none'}
                            fontSize={'lg'}
                            fontWeight={'semibold'}
                        >
                            <Text> {title}</Text>
                        </PopoverHeader>
                        <PopoverBody width={'100%'} boxShadow={'lg'} height={'350px'}>
                            {!items.length && noItemsWarning}
                            {!hasChildren && (
                                <Grid gridTemplateColumns={'repeat(3, 1fr)'} gridGap={2}>
                                    {items.map((item) => (
                                        <GridItem key={item.id}>
                                            <Button
                                                onClick={() => {
                                                    onChange(item.value);
                                                    handleClose();
                                                }}
                                                width={'100%'}
                                                colorScheme={
                                                    value?.id === item.id ? 'blue' : undefined
                                                }
                                                variant={
                                                    value?.id === item.id ? 'outline' : 'solid'
                                                }
                                            >
                                                {item.label}
                                            </Button>
                                        </GridItem>
                                    ))}
                                    {addItem && (
                                        <GridItem>
                                            <Button
                                                leftIcon={<Icon as={Icons.Add} />}
                                                onClick={() => {
                                                    addItem();
                                                }}
                                                width={'100%'}
                                                variant={'solid'}
                                            >
                                                {t('finance:add')}
                                            </Button>
                                        </GridItem>
                                    )}
                                </Grid>
                            )}
                            {hasChildren && (
                                <NestedPicklistSelect
                                    value={value}
                                    items={items}
                                    onChange={onChange}
                                    onClose={handleClose}
                                    addItem={addItem}
                                />
                            )}
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
            </FormControl>
        </Box>
    );
};

const NestedPicklistSelect = <
    T extends {
        id: string;
        name: string;
    },
>({
    value,
    items,
    onChange,
    onClose,
    addItem,
}: {
    value: T | undefined;
    items: PicklistItem<T>[];
    onChange: (value: T) => void;
    onClose: (callback?: () => void) => void;
    addItem?: any;
}) => {
    const [selectedParent, setSelectedParent] = React.useState<PicklistItem<T> | null>(null);

    const { t } = useTranslation();

    const handleClose = () => {
        onClose(() => {
            setSelectedParent(null);
        });
    };

    const showChildren = items.some((i) => i.children?.length);
    return (
        <Grid
            py={2}
            gridTemplateColumns={showChildren ? '1fr 1px 1fr' : '1fr'}
            // gridTemplateRows={`repeat(${items.length}, 60px)`}
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
                                onChange(item.value);
                                handleClose();
                            }}
                            width={'100%'}
                            justifyContent={'space-between'}
                            rightIcon={
                                item.children?.length ? (
                                    <Icon fontSize='lg' as={Icons.Right} />
                                ) : undefined
                            }
                            colorScheme={value?.id === item.id ? 'blue' : undefined}
                            variant={value?.id === item.id ? 'outline' : 'solid'}
                        >
                            {item.label}
                        </Button>
                    ))}
                    {addItem && (
                        <Button
                            minH={'40px'}
                            leftIcon={<Icon as={Icons.Add} />}
                            onClick={() => {
                                addItem();
                            }}
                            width={'100%'}
                            justifyContent={'start'}
                            variant={'solid'}
                        >
                            {t('finance:add')}
                        </Button>
                    )}
                </Stack>
            </GridItem>
            {showChildren && (
                <>
                    <GridItem>
                        <Divider orientation='vertical' w={'1px'} />
                    </GridItem>
                    <GridItem>
                        <Stack spacing={3} ml={1.5}>
                            {selectedParent?.children?.map((item) => (
                                <Button
                                    key={item.id}
                                    onClick={() => {
                                        onChange(item.value);
                                        handleClose();
                                    }}
                                    h={'40px'}
                                    width={'100%'}
                                    textAlign={'left'}
                                    justifyContent={'space-between'}
                                    colorScheme={value?.id === item.id ? 'blue' : ''}
                                    variant={value?.id === item.id ? 'outline' : 'solid'}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Stack>
                    </GridItem>
                </>
            )}
        </Grid>
    );
};

SelectFromPicklistField.defaultProps = {
    hasChildren: false,
};
