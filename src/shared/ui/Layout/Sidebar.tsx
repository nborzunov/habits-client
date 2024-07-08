import { Box, BoxProps, Divider, Flex, Stack, Text, Wrap } from '@chakra-ui/react';
import { activeUserState } from '@entities/auth';
import { habitsState } from '@entities/habit';
import { ProfileInfoToolbar } from '@features/profile-info-toolbar';
import { useMobile } from '@shared/hooks';
import { FEATURE_FLAGS, Icons$ } from '@shared/lib';
import { openSettingsDialog } from '@widgets/settings/ui/SettingsDialog';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import { NavItem } from './NavItem';

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

    const minimizeSidebar = false;
    return (
        <Box
            as='nav'
            borderRightColor='gray.200'
            borderRightWidth='2px'
            pos='fixed'
            top='0'
            left='0'
            zIndex='sticky'
            h='100%'
            overflowX='hidden'
            overflowY='auto'
            bg='white'
            {...props}
            width={isMobile ? '100%' : minimizeSidebar ? '56px' : '220px'}
        >
            <Flex px={!minimizeSidebar ? 8 : 5} py='6' align='center'>
                {!minimizeSidebar ? (
                    <>
                        {/* <Logo /> */}
                        <Text fontSize='2xl' color='gray.500' fontWeight='semibold'>
                            Habits
                        </Text>
                    </>
                ) : (
                    <>
                        {/* <Logo /> */}
                        <Text fontSize='2xl' color='gray.500' fontWeight='semibold'>
                            H
                        </Text>
                    </>
                )}
            </Flex>
            <Flex
                direction='column'
                justify={'space-between'}
                as='nav'
                fontSize='sm'
                color='gray.500'
                aria-label='Main Navigation'
                height={'calc(100% - 84px)'}
            >
                <Flex
                    direction='column'
                    px={minimizeSidebar ? '2' : '4'}
                    w={minimizeSidebar ? '40px' : 'auto'}
                    zIndex='dropdown'
                    position='relative'
                >
                    <ProfileInfoToolbar isOpenable={FEATURE_FLAGS.PROFILE} />

                    <Wrap my={4}>
                        <Divider />
                    </Wrap>

                    <Stack direction='column' spacing={minimizeSidebar ? 2 : 0}>
                        {FEATURE_FLAGS.HABITS && (
                            <NavLink to='habits'>
                                <NavItem icon={Icons$.Inbox}>{t('habits:allHabits')}</NavItem>
                            </NavLink>
                        )}

                        {FEATURE_FLAGS.FINANCE && (
                            <NavLink to='finance'>
                                <NavItem icon={Icons$.Finance}>{t('finance:finance')}</NavItem>
                            </NavLink>
                        )}
                        {FEATURE_FLAGS.ACHIEVEMENTS && (
                            <NavLink to='achievements'>
                                <NavItem icon={Icons$.Award}>
                                    {t('achievements:achievements')}
                                </NavItem>
                            </NavLink>
                        )}
                        {/*<NavLink to='dashboard'>*/}
                        {/*    <NavItem icon={Icons$.Dashboard}>Dashboard</NavItem>*/}
                        {/*</NavLink>*/}
                    </Stack>
                </Flex>
                <Stack
                    direction='column'
                    spacing={minimizeSidebar ? 2 : 0}
                    px={minimizeSidebar ? '2' : '4'}
                    w={minimizeSidebar ? '40px' : 'auto'}
                    pb={6}
                >
                    {FEATURE_FLAGS.SETTINGS && (
                        <NavItem icon={Icons$.Settings} onClick={() => openSettingsDialog({})}>
                            {t('common:settings')}
                        </NavItem>
                    )}
                    <NavItem icon={Icons$.Logout} onClick={logout}>
                        {t('common:logout')}
                    </NavItem>
                </Stack>
            </Flex>
        </Box>
    );
};
