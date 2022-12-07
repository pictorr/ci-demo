import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { appTexts } from './javascript/i18n/appTexts';

let lang = localStorage.getItem('language');
if (!lang) { lang = 'ro'; }

i18n
    .use(initReactI18next)
    .init({
        lng: lang,
        fallbackLng: lang,
        resources: {
            ro: { translation: appTexts.ro },
            en: { translation: appTexts.en },
            bg: { translation: appTexts.bg },
            cr: { translation: appTexts.cr },
            gr: { translation: appTexts.gr },
            pl: { translation: appTexts.pl },
        },
        interpolation: {
            escapeValue: false,
        }
    });
