import { useTheme } from '@chakra-ui/react';
import { useMemo } from 'react';

export const useCustomScroll = () => {
    const theme = useTheme();

    return useMemo(
        () => ({
            '&': {
                overflowY: 'scroll',
            },
            '&::-webkit-scrollbar': {
                width: '6px',
                height: '6px',
            },
            '&::-webkit-scrollbar-track': {
                borderRadius: '10px',
                background: theme.colors.gray[100],
            },
            '&::-webkit-scrollbar-thumb': {
                borderRadius: '10px',
                background: theme.colors.gray[300],
            },
            '&::-webkit-scrollbar-thumb:hover': {
                background: theme.colors.gray[400],
            },
            '&::-webkit-scrollbar-thumb:active': {
                background: theme.colors.gray[500],
            },
        }),
        [theme],
    );
};