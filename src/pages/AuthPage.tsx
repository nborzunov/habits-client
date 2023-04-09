import { Box, useColorModeValue } from '@chakra-ui/react';
import React, { PropsWithChildren } from 'react';

export const AuthPage = ({ children }: PropsWithChildren) => {
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
                maxW={'lg'}
                width={'100%'}
                mx={4}
                p={{
                    base: 8,
                    sm: 6,
                }}
            >
                {children}
            </Box>
        </Box>
    );
};
