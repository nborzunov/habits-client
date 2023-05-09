import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import relativeTime from 'dayjs/plugin/relativeTime';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import { BREAKPOINTS } from '~/common/constants';
import { DialogProvider } from '~/common/hooks/useDialog';

import App from './App';
import './i18n.ts';
import './index.css';
import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';

dayjs.extend(relativeTime);

const theme = extendTheme({
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

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <RecoilRoot>
                <QueryClientProvider client={queryClient}>
                    <DialogProvider>
                        <App />
                    </DialogProvider>
                </QueryClientProvider>
            </RecoilRoot>
        </ChakraProvider>
    </React.StrictMode>,
);
