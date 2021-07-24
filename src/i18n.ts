import i18n, { InterpolationOptions, TFunction } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import {initReactI18next} from "react-i18next";
import languageEN from "./locate/en/translate.json";
import languageES from "./locate/es/translate.json";

let t:TFunction;

i18n.use(LanguageDetector).use(initReactI18next).init({
    resources: {
        en: languageEN,
        es: languageES
    },
    /* default language when load the website in browser */
    lng: "en",
    /* When react i18next not finding any language to as default in borwser */
    fallbackLng: "en",
    /* debugger For Development environment */
    debug: true,
    ns: ["translations"],
    defaultNS: "translations",
    keySeparator: ".",
    interpolation: {
        escapeValue: false,
        formatSeparator: ",",
        format: (value?:any, format?:string, lang?:string, options?: (InterpolationOptions & { [key: string]: any; })):string => {
            switch (format) {
                case "number":
                    if (typeof(value) === "number")
                        return value.toLocaleString(lang);
                    else return t("general.error.format.typeMismatch");
                default: return t("general.error.format.noFormat");
            }
        }
    },
    react: {
        wait: true,
        bindI18n: "languageChanged loaded",
        nsMode: "default"
    }
},(e,tIn)=>{
    if (e) throw e;
    else t=tIn;
});

export default i18n;