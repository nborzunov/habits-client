import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RouterProvider } from 'react-router-dom';

import { appRouter } from '../appRouter';

export const BaseLayout = () => {
    const { i18n } = useTranslation();

    useEffect(() => {
        dayjs.locale(i18n.options.lng);
    }, [i18n.options.lng]);

    return <RouterProvider router={appRouter} />;
};
