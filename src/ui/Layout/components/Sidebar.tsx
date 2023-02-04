import { Box, BoxProps, Flex, Text } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import Icons from '~/common/helpers/Icons';
import useMobile from '~/common/hooks/useMobile';
import { ProfileInfo } from '~/modules/Profile';
import { LayoutContext } from '~/ui/Layout/components/Layout';
import { NavItem } from '~/ui/Layout/components/NavItem';

export const Sidebar = (props: React.PropsWithChildren<BoxProps>) => {
    const isMobile = useMobile();
    const { onCloseMenu } = useContext(LayoutContext);

    const { t } = useTranslation();
    return (
        <Box
            as='nav'
            pos='fixed'
            top='0'
            left='0'
            zIndex='sticky'
            h='full'
            pb='10'
            overflowX='hidden'
            overflowY='auto'
            bg='white'
            {...props}
            width={isMobile ? '100%' : props.width}
        >
            <Flex px='8' py='6' align='center'>
                {/* <Logo /> */}
                <Text fontSize='2xl' color='gray.500' fontWeight='semibold'>
                    Habits
                </Text>
            </Flex>
            <Flex
                direction='column'
                as='nav'
                fontSize='sm'
                color='gray.500'
                aria-label='Main Navigation'
                onClick={onCloseMenu}
                // my={'16'}
            >
                <ProfileInfo />

                <NavLink to='habits'>
                    <NavItem icon={Icons.Inbox}>{t('habits:allHabits')}</NavItem>
                </NavLink>
                {/*<NavLink to='dashboard'>*/}
                {/*    <NavItem icon={Icons.Dashboard}>Dashboard</NavItem>*/}
                {/*</NavLink>*/}
            </Flex>

            {/*<Flex*/}
            {/*    direction='column'*/}
            {/*    as='nav'*/}
            {/*    fontSize='sm'*/}
            {/*    color='gray.500'*/}
            {/*    aria-label='Main Navigation'*/}
            {/*>*/}
            {/*    <NavLink to='habits'>*/}
            {/*        <NavItem icon={Icons.Inbox}>All habits</NavItem>*/}
            {/*    </NavLink>*/}

            {/*    <NavItem>Logout</NavItem>*/}
            {/*</Flex>*/}
        </Box>
    );
};
