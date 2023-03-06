import { Box, BoxProps, Flex, Text, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import Icons from '~/common/helpers/Icons';
import useMobile from '~/common/hooks/useMobile';
import { activeUserState, habitsState } from '~/common/store/atoms';
import { ProfileInfo } from '~/modules/Profile';
import { NavItem } from '~/ui/Layout/components/NavItem';
import { SettingsDialog } from '~/ui/Layout/components/SettingsDialog';

export const Sidebar = (props: React.PropsWithChildren<BoxProps>) => {
    const isMobile = useMobile();

    const { t } = useTranslation();

    const setHabits = useSetRecoilState(habitsState);
    const setActiveUser = useSetRecoilState(activeUserState);

    const navigate = useNavigate();

    const logout = () => {
        setHabits([]);
        setActiveUser(null);
        setActiveUser(null);
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    const {
        isOpen: isOpenSettingsDialog,
        onOpen: onOpenSettingsDialog,
        onClose: onCloseSettingsDialog,
    } = useDisclosure();
    return (
        <Box
            as='nav'
            pos='fixed'
            top='0'
            left='0'
            zIndex='sticky'
            h='100%'
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
                justifyContent={'space-between'}
                as='nav'
                fontSize='sm'
                color='gray.500'
                aria-label='Main Navigation'
                height={'calc(100% - 84px)'}
            >
                <Flex direction='column'>
                    <ProfileInfo />

                    <NavLink to='habits'>
                        <NavItem icon={Icons.Inbox}>{t('habits:allHabits')}</NavItem>
                    </NavLink>
                    <NavLink to='achievements'>
                        <NavItem icon={Icons.Award}>{t('achievements:achievements')}</NavItem>
                    </NavLink>
                    {/*<NavLink to='dashboard'>*/}
                    {/*    <NavItem icon={Icons.Dashboard}>Dashboard</NavItem>*/}
                    {/*</NavLink>*/}
                </Flex>
                <Flex direction='column' pb={6}>
                    <NavItem icon={Icons.Settings} onClick={onOpenSettingsDialog}>
                        {t('common:settings')}
                    </NavItem>
                    <SettingsDialog isOpen={isOpenSettingsDialog} onClose={onCloseSettingsDialog} />
                    <NavItem icon={Icons.Logout} onClick={logout}>
                        {t('common:logout')}
                    </NavItem>
                </Flex>
            </Flex>
        </Box>
    );
};
