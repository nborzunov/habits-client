import NiceModal from '@ebay/nice-modal-react';
import { ToastContainer } from '@shared/const/toast';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import relativeTime from 'dayjs/plugin/relativeTime';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';

import './i18n';
import './index.css';
import { BaseLayout } from './layouts/BaseLayout';
import { QueryProvider } from './providers/QueryProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';

dayjs.extend(relativeTime);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThemeProvider>
            <RecoilRoot>
                <QueryProvider>
                    <NiceModal.Provider>
                        <BaseLayout />
                        <ToastContainer />
                    </NiceModal.Provider>
                </QueryProvider>
            </RecoilRoot>
        </ThemeProvider>
    </React.StrictMode>,
);
