import {
    Box,
    Drawer,
    DrawerCloseButton,
    DrawerContent,
    DrawerOverlay,
    Skeleton,
    useDisclosure,
} from '@chakra-ui/react';
import { createContext } from 'react';
import { Outlet } from 'react-router-dom';
import useMobile from '~/common/hooks/useMobile';
import { Sidebar } from '~/ui/Layout/components/Sidebar';

interface LayoutContext {
    isMenuOpened: boolean;
    onOpenMenu: () => void;
    onCloseMenu: () => void;
}

export const LayoutContext = createContext<LayoutContext>({
    isMenuOpened: false,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onOpenMenu: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onCloseMenu: () => {},
});
export const Layout = ({ loading }: { loading: boolean }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const isMobile = useMobile();

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
                <LayoutContext.Provider
                    value={{
                        isMenuOpened: isOpen,
                        onOpenMenu: onOpen,
                        onCloseMenu: onClose,
                    }}
                >
                    {!isMobile && (
                        <Sidebar
                            display={{
                                base: 'none',
                                md: 'unset',
                            }}
                            width={{
                                sm: '20em',
                                md: '20em',
                                lg: '12em',
                                xl: '14em',
                                '2xl': '15.5em',
                            }}
                        />
                    )}

                    <Drawer isOpen={isOpen} onClose={onClose} placement='left'>
                        <DrawerOverlay />
                        <DrawerContent>
                            {isMobile && <DrawerCloseButton zIndex={11000} />}
                            <Sidebar
                                w='full'
                                borderRight='none'
                                width={{
                                    sm: '20em',
                                    md: '20em',
                                    lg: '12em',
                                    xl: '14em',
                                    '2xl': '15.5em',
                                }}
                            />
                        </DrawerContent>
                    </Drawer>
                    <Box
                        ml={{
                            sm: '0',
                            md: '20em',
                            lg: '12em',
                            xl: '14em',
                            '2xl': '15.5em',
                        }}
                        transition='.3s ease'
                    >
                        <Box as='main' width={'100%'}>
                            <Outlet />
                        </Box>
                    </Box>
                </LayoutContext.Provider>
            </Box>
        </Skeleton>
    );
};
