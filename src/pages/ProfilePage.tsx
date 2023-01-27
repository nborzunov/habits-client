import { Box, Link as ChakraLink, Flex, Stack, useColorModeValue } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { Link, Navigate, Route, Routes, useMatch } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { activeUserState } from '~/common/store/atoms';
import {
    ChangeEmail,
    ChangePassword,
    CleanData,
    DeleteAccount,
    EditProfile,
    Notifications,
    ProfileDetails,
} from '~/modules/Profile';

export const ProfilePage = () => {
    const user = useRecoilValue(activeUserState);

    const initialState = useMemo(() => {
        return {
            name: user?.name || '',
            surname: user?.surname || '',
            username: user?.username || '',
            email: user?.email || '',
            bio: user?.bio || '',
        };
    }, [user]);

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
                        <ProfilePageLink path='' name='View Profile' />
                        <ProfilePageLink path='edit' name='Edit Profile' />
                        <ProfilePageLink path='notifications' name='Notifications' />
                        <ProfilePageLink path='change-password' name='Change Password' />
                        <ProfilePageLink path='change-email' name='Change Email' />
                        <ProfilePageLink path='delete-account' name='Delete Account' />
                        <ProfilePageLink path='clean-data' name='Clean Data' />
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
                        {/*TODO: user profile route*/}
                        <Route path='' element={<ProfileDetails />} />
                        <Route path='edit' element={<EditProfile initialState={initialState} />} />
                        <Route path='notifications' element={<Notifications />} />
                        <Route path='change-password' element={<ChangePassword />} />
                        <Route
                            path='change-email'
                            element={<ChangeEmail initialState={{ email: initialState.email }} />}
                        />
                        <Route path='delete-account' element={<DeleteAccount />} />
                        <Route path='clean-data' element={<CleanData />} />
                        <Route path='*' element={<Navigate to='' replace />} />
                    </Routes>
                </Box>
            </Flex>
        </Flex>
    );
};

const ProfilePageLink = ({ path, name }: { path: string; name: string }) => {
    const matchedRoute = useMatch(path);

    return (
        <ChakraLink
            as={Link}
            to={path}
            fontWeight={matchedRoute ? 'semibold' : 'normal'}
            fontSize={'lg'}
        >
            {name}
        </ChakraLink>
    );
};
