import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import common_en from "./en.json";
import common_et from "./et.json";

const debug = false;

i18n
    .use(initReactI18next)
    .init({
        lng: 'en',
        fallbackLng: 'en',

        // have a common namespace used around the full app
        ns: ['translations'],
        defaultNS: 'translations',

        debug: debug,

        react: {
            wait: true, // false
            // withRef: false,
            // bindI18n: 'languageChanged loaded',
            // bindStore: 'added removed',
            // nsMode: 'default'
        },

        interpolation: {
            // React already does escaping
            escapeValue: false,
        },

        resources: {
            en: {
                // 'translations' is our custom namespace
                translations: common_en
            },
            et: {
                translations: common_et
            },
        }
    });
export default i18n