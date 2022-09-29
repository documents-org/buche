import { fr } from "./fr";
import { en } from "./en";

const langs = {
    fr,
    en,
};

export const t_ = (string: string, lang: 'en' | 'fr') : string => {
    const l = langs[lang];
    if (!l) return string;
    const s = l[string];
    if (!s) return string;
    return s;
};