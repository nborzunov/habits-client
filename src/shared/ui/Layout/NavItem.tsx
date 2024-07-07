import { Flex, Icon, Tooltip } from '@chakra-ui/react';
import { LucideIcon } from 'lucide-react';
import { PropsWithChildren } from 'react';
import { IconType } from 'react-icons/lib';

interface NavItemProps {
    icon?: IconType | LucideIcon;
    onClick?: () => void;
}

export const NavItem = (props: PropsWithChildren<NavItemProps>) => {
    const { icon, children, ...rest } = props;

    const minimizeSidebar = false;

    return (
        <Tooltip label={children} placement='bottom' isDisabled={!minimizeSidebar} openDelay={500}>
            <Flex
                align='center'
                width={!minimizeSidebar ? '100%' : '40px'}
                px={!minimizeSidebar ? '4' : '3'}
                rounded='md'
                py={!minimizeSidebar ? '3' : '3'}
                cursor='pointer'
                color='gray.600'
                _hover={{
                    bg: 'purple.300',
                    color: 'whiteAlpha.900',
                }}
                role='group'
                fontWeight='semibold'
                transition='.15s ease'
                {...rest}
            >
                {icon && <Icon mr={!minimizeSidebar ? '2' : '0'} boxSize='4' as={icon} />}
                {!minimizeSidebar && children}
            </Flex>
        </Tooltip>
    );
};
