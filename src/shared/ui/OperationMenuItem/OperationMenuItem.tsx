import { Flex, Icon, MenuItem, Text } from '@chakra-ui/react';
import { MouseEventHandler } from 'react';

export const OperationMenuItem = ({
    onClick,
    icon,
    label,
}: {
    onClick?: MouseEventHandler<HTMLButtonElement>;
    icon?: any;
    label: string;
}) => {
    return (
        <MenuItem
            onClick={onClick}
            pl='4'
            rounded='md'
            py='3'
            cursor='pointer'
            color='gray.600'
            _hover={{
                bg: 'purple.300',
                color: 'whiteAlpha.900',
            }}
            role='group'
            fontWeight='semibold'
            transition='.15s ease'
        >
            <Flex align={'center'}>
                {icon && <Icon as={icon} mr={2} />}
                <Text>{label}</Text>
            </Flex>
        </MenuItem>
    );
};
