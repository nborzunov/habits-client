import { Flex, HStack, Icon, IconButton, Text, Tooltip } from '@chakra-ui/react';
import { Icons$ } from '@shared/lib';
import { t } from 'i18next';

interface ListItemProps {
    id: string;
    color: string;
    icon: any;
    label: string;
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
}

export const ItemTypes = {
    Account: 'account',
};

export const ListItem = (props: ListItemProps) => {
    return (
        <Flex width='100%' align='center' justify={'space-between'} h='36px'>
            <Flex align='center'>
                <Icon
                    bg={`${props.color}.400`}
                    color='white'
                    fontSize={'4xl'}
                    mr={3}
                    as={props.icon}
                    p={2}
                    borderRadius={'xl'}
                    boxShadow={'sm'}
                />
                <Text fontWeight='semibold' fontSize='lg' color={'gray.600'}>
                    {props.label}
                </Text>
            </Flex>
            <HStack spacing={2} mr={2}>
                <Tooltip label={t('common:edit')}>
                    <IconButton
                        icon={<Icon as={Icons$.Edit} />}
                        aria-label={'edit'}
                        colorScheme='blue'
                        variant='outline'
                        size='sm'
                        onClick={() => props.onEdit(props.id)}
                    />
                </Tooltip>

                <Tooltip label={t('common:delete')}>
                    <IconButton
                        icon={<Icon as={Icons$.Delete} />}
                        aria-label={'delete'}
                        colorScheme='red'
                        variant='outline'
                        size='sm'
                        onClick={() => props.onDelete(props.id)}
                    />
                </Tooltip>
            </HStack>
        </Flex>
    );
};
