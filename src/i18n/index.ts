import uk from './uk.json';

const dictionaries = { uk };

export type Locale = keyof typeof dictionaries;

export const locale: Locale = 'uk';

export const t = dictionaries[locale];
