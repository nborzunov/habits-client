import { Box, Flex, Link as ChakraLink, Stack, useColorModeValue } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import EditProfile from '~/Profile/components/EditProfile';
import { Link, Navigate, Route, Routes, useMatch } from 'react-router-dom';
import { User } from '~/Profile/types';
import Notifications from '~/Profile/components/Notifications';
import CleanData from '~/Profile/components/CleanData';
import DeleteAccount from '~/Profile/components/DeleteAccount';
import ChangeEmail from '~/Profile/components/ChangeEmail';
import ChangePassword from '~/Profile/components/ChangePassword';
import ProfileDetails from '~/Profile/components/ProfileDetails';

const ProfilePage = ({ user }: { user: User | null }) => {
    const initialState = useMemo(() => {
        return {
            name: user?.name || '',
            surname: user?.surname || '',
            username: user?.username || '',
            email: user?.email || '',
            bio: user?.bio || '',
        };
    }, [user]);

    const routes = [
        {
            path: '/me/',
            name: 'View Profile',
        },
        {
            path: '/me/edit',
            name: 'Edit Profile',
        },
        {
            path: '/me/notifications',
            name: 'Notifications',
        },
        {
            path: '/me/change-password',
            name: 'Change Password',
        },
        {
            path: '/me/change-email',
            name: 'Change Email',
        },

        {
            path: '/me/delete-account',
            name: 'Delete Account',
        },
        {
            path: '/me/clean-data',
            name: 'Clean Data',
        },
    ];
    return (
        <Flex
            p={5}
            as='section'
            bg='blue.50'
            _dark={{
                bg: 'gray.700',
            }}
            minH='100vh'
            display={'flex'}
            alignItems={'start'}
            justifyContent={'center'}
        >
            <Flex mt={'16'}>
                <Box width={250} mr={5} p={8}>
                    <Stack spacing={3}>
                        {routes.map((route) => (
                            <ProfilePageLink key={route.path} route={route} />
                        ))}
                    </Stack>
                </Box>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    mx={'auto'}
                    maxW={'lg'}
                    minW={'800px'}
                    height={'auto'}
                    p={8}
                >
                    <Routes>
                        <Route
                            path='/'
                            element={<ProfileDetails title={`${user?.name} ${user?.surname}`} />}
                        />
                        <Route
                            path='/edit'
                            element={
                                <EditProfile
                                    initialState={initialState}
                                    title={`${user?.name} ${user?.surname} - Edit Profile`}
                                />
                            }
                        />
                        <Route
                            path='/notifications'
                            element={
                                <Notifications
                                    title={`${user?.name} ${user?.surname} - Notifications`}
                                />
                            }
                        />
                        <Route
                            path='/change-password'
                            element={
                                <ChangePassword
                                    title={`${user?.name} ${user?.surname} - Change Password`}
                                />
                            }
                        />

                        <Route
                            path='/change-email'
                            element={
                                <ChangeEmail
                                    initialState={{ email: initialState.email }}
                                    user={user}
                                    title={`${user?.name} ${user?.surname} - Change Email`}
                                />
                            }
                        />
                        <Route
                            path='/delete-account'
                            element={
                                <DeleteAccount
                                    title={`${user?.name} ${user?.surname} - Delete Account`}
                                />
                            }
                        />
                        <Route
                            path='/clean-data'
                            element={
                                <CleanData title={`${user?.name} ${user?.surname} - Clean Data`} />
                            }
                        />
                        <Route path='*' element={<Navigate to='/me/edit' replace />} />
                    </Routes>
                </Box>
            </Flex>
        </Flex>
    );
};

const ProfilePageLink = ({ route }: { route: { path: string; name: string } }) => {
    const matchedRoute = useMatch(route.path);

    return (
        <ChakraLink
            as={Link}
            to={route.path}
            fontWeight={matchedRoute ? 'semibold' : 'normal'}
            fontSize={'xl'}
        >
            {route.name}
        </ChakraLink>
    );
};
export default ProfilePage;
