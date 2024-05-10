import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { BREAKPOINTS } from '@shared/const';
import { PropsWithChildren } from 'react';

export const theme = extendTheme({
    colors: {
        blue: {
            50: '#F6F8FA',
        },
    },
    breakpoints: {
        sm: `${BREAKPOINTS.sm}em`,
        md: `${BREAKPOINTS.md}em`,
        lg: `${BREAKPOINTS.lg}em`,
        xl: `${BREAKPOINTS.xl}em`,
        '2xl': `${BREAKPOINTS['2xl']}em`,
    },
});

export const ThemeProvider = ({ children }: PropsWithChildren) => {
    return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
};
