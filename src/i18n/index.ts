import uk from './uk.json';
import en from './en.json';

const dictionaries = { uk, en } satisfies Record<string, typeof uk>;

export type Locale = keyof typeof dictionaries;
export type Dict = typeof uk;

export const locales = ['uk', 'en'] as const satisfies readonly Locale[];
export const defaultLocale: Locale = 'uk';

const ogLocales: Record<Locale, string> = {
  uk: 'uk_UA',
  en: 'en_US',
};

export const resolveLocale = (value?: string | null): Locale =>
  value && value in dictionaries ? (value as Locale) : defaultLocale;

export const tFor = (value?: string | null): Dict => dictionaries[resolveLocale(value)];

export const pathFor = (locale: Locale): string =>
  locale === defaultLocale ? '/' : `/${locale}/`;

export const ogLocale = (value?: string | null): string => ogLocales[resolveLocale(value)];
