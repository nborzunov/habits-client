import {
    Box,
    Drawer,
    DrawerContent,
    DrawerOverlay,
    Skeleton,
    useDisclosure,
} from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Sidebar from '~/ui/Layout/components/Sidebar';

const Layout = ({ loading }: { loading: boolean }) => {
    const sidebar = useDisclosure();

    return (
        <Skeleton isLoaded={!loading}>
            <Box
                as='section'
                bg='blue.50'
                _dark={{
                    bg: 'gray.700',
                }}
                minH='100vh'
            >
                <Sidebar
                    display={{
                        base: 'none',
                        md: 'unset',
                    }}
                />
                <Drawer isOpen={sidebar.isOpen} onClose={sidebar.onClose} placement='left'>
                    <DrawerOverlay />
                    <DrawerContent>
                        <Sidebar w='full' borderRight='none' />
                    </DrawerContent>
                </Drawer>
                <Box
                    ml={{
                        base: 0,
                        md: 60,
                    }}
                    transition='.3s ease'
                >
                    <Box as='main'>
                        <Outlet />
                    </Box>
                </Box>
            </Box>
        </Skeleton>
    );
};

export default Layout;
