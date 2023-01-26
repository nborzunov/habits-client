import { Box, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Auth, Login, Signup } from '~/modules/Auth';

export const AuthPage = ({ refetchUser }: { refetchUser: () => void }) => {
    return (
        <Box
            as='section'
            bg='blue.50'
            _dark={{
                bg: 'gray.700',
            }}
            minH='100vh'
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
        >
            <Box
                rounded={'lg'}
                bg={useColorModeValue('white', 'gray.700')}
                boxShadow={'lg'}
                mx={'auto'}
                maxW={'lg'}
                minW={'500px'}
                p={8}
            >
                <Routes>
                    <Route path='/' element={<Auth />} />
                    <Route path='signup' element={<Signup refetch={refetchUser} />} />
                    <Route path='login' element={<Login refetch={refetchUser} />} />
                    <Route path='*' element={<Navigate to='/login' replace />} />
                </Routes>
            </Box>
        </Box>
    );
};
