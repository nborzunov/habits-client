import {
    Box,
    Drawer,
    DrawerCloseButton,
    DrawerContent,
    DrawerOverlay,
    Skeleton,
    useDisclosure,
} from '@chakra-ui/react';
import { useAchievementsWS } from '@entities/achievement';
import { useActiveUser } from '@entities/auth';
import { setTitle, useMobile } from '@shared/hooks';
import { Sidebar } from '@shared/ui/Layout';
import { createContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { Navigate, Outlet } from 'react-router-dom';

interface LayoutContext {
    isMenuOpened: boolean;
    onOpenMenu: () => void;
    onCloseMenu: () => void;
}

export const LayoutContext = createContext<LayoutContext>({
    isMenuOpened: false,
    onOpenMenu: () => {},
    onCloseMenu: () => {},
});
export const Layout = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isFetched, data } = useActiveUser();
    const { t } = useTranslation();
    const isMobile = useMobile();
    const location = useLocation();
    const minimizeSidebar = false;

    useAchievementsWS();

    useEffect(() => {
        setTitle(t('common:habits'));
    }, [t]);

    if (isFetched && !data) {
        return (
            <Navigate
                to={{
                    pathname: '/login',
                    search: location.pathname ? `?from=${location.pathname}` : '',
                }}
            />
        );
    }

    if (location.pathname === '/') {
        return <Navigate to='/habits' />;
    }

    return (
        <Skeleton isLoaded={isFetched}>
            <Box as='section' bg='gray.50' minH='100vh'>
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
                    <Box ml={!minimizeSidebar ? '220px' : '56px'} transition='.3s ease'>
                        <Box as='main' width={'100%'}>
                            <Outlet />
                        </Box>
                    </Box>
                </LayoutContext.Provider>
            </Box>
        </Skeleton>
    );
};
