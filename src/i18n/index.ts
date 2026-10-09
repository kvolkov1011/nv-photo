import en from './en.json';

const dictionaries = { en };

export type Locale = keyof typeof dictionaries;

export const locale: Locale = 'en';

export const t = dictionaries[locale];
