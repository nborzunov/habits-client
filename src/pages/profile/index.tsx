import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import { activeUserState } from '@entities/auth';
import { ProfileInfoToolbar } from '@features/profile-info-toolbar';
import { useMobile } from '@shared/hooks';
import { MobileMenu } from '@shared/ui/Layout/MobileMenu';
import React, { useMemo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import { ChangeEmail } from '../../widgets/profile-details/ui/ChangeEmail';
import { ChangePassword } from '../../widgets/profile-details/ui/ChangePassword';
import { CleanData } from '../../widgets/profile-details/ui/CleanData';
import { DeleteAccount } from '../../widgets/profile-details/ui/DeleteAccount';
import { EditProfile } from '../../widgets/profile-details/ui/EditProfile';
import { Notifications } from '../../widgets/profile-details/ui/Notifications';
import { ProfileDetails } from '../../widgets/profile-details/ui/ProfileDetails';

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
                        <MobileMenu />
                        <ProfileInfoToolbar />
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
                    p={{
                        base: 8,
                        sm: 6,
                    }}
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
