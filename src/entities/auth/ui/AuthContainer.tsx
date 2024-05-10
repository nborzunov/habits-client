import { Box, Center, useColorModeValue } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

export const AuthContainer = ({ children }: PropsWithChildren) => {
    return (
        <Center
            bg='blue.50'
            _dark={{
                bg: 'gray.700',
            }}
            minH='100vh'
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
        </Center>
    );
};
