import {
    Box,
    Drawer,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Heading,
} from '@chakra-ui/react';
import { t } from 'i18next';
import { PropsWithChildren } from 'react';

export const AddWidgetsDrawer = ({
    isOpen,
    onClose,
    children,
}: PropsWithChildren<{ isOpen: boolean; onClose: () => void }>) => {
    return (
        <Drawer isOpen={isOpen} placement='right' onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent
                width={{
                    sm: '20em',
                    md: '20em',
                    lg: '12em',
                    xl: '14em',
                    '2xl': '15.5em',
                }}
            >
                <DrawerCloseButton />
                <DrawerHeader>
                    <Heading as='h3' size='md'>
                        {t('habits:widgets')}
                    </Heading>
                </DrawerHeader>
                <Box p={4}>{children}</Box>
            </DrawerContent>
        </Drawer>
    );
};
