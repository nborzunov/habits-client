import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import useMobile from '~/common/hooks/useMobile';
import { activeUserState } from '~/common/store/atoms';
import {
    ChangeEmail,
    ChangePassword,
    CleanData,
    DeleteAccount,
    EditProfile,
    Notifications,
    ProfileDetails,
    ProfileInfo,
} from '~/modules/Profile';
import { MobileMenu } from '~/ui/Layout/components/MobileMenu';

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

    const isMobile = useMobile();

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
            flexWrap='wrap'
        >
            <Box maxW={'3xl'} minH={'xs'} width={'100%'} height={'auto'}>
                {isMobile && (
                    <Flex mb={4} justifyContent={'space-between'}>
                        <MobileMenu /> <ProfileInfo />
                    </Flex>
                )}
                <Box
                    mt={{
                        lg: '16',
                        md: '16',
                        sm: '0',
                    }}
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
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
            </Box>
        </Flex>
    );
};
