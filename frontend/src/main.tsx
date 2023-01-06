import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

// styles
import './index.css';
import { RecoilRoot } from 'recoil';
import { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
const theme = extendTheme({
    colors: {
        blue: {
            50: '#F6F8FA',
        },
    },
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <RecoilRoot>
                <QueryClientProvider client={queryClient}>
                    <App />
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
            </RecoilRoot>
        </ChakraProvider>
    </React.StrictMode>,
);
