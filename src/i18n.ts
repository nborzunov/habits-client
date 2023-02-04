import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import { en } from '../assets/locales/en';
import { ru } from '../assets/locales/ru';

const userLang = navigator.language.slice(0, 2);
const storedLang = localStorage.getItem('lang');

const lang = storedLang || userLang || 'en';

localStorage.setItem('lang', lang);

i18next.use(initReactI18next).init({
    lng: lang,
    fallbackLng: 'en',
    ns: ['common', 'habits', 'profile'],
    defaultNS: 'common',
    resources: {
        en: en,
        ru: ru,
    },
    returnNull: false,
});
