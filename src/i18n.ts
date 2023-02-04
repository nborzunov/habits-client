import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en } from '../assets/locales/en';
import { ru } from '../assets/locales/ru';

i18next.use(initReactI18next).init({
    fallbackLng: 'ru',
    ns: ['common', 'habits', 'profile'],
    defaultNS: 'common',
    resources: {
        en: en,
        ru: ru,
    },
    returnNull: false,
    // compatibilityJSON: 'v3'
});
