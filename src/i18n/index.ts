/**
 * i18n barrel — re-exports everything so consumers can import from
 * `'../i18n/translations'` without changing any component code.
 */

export type { Locale, Translation, ProjectStatus } from './types';
export { shared, TAGS, REPOS } from './types';
import type { Locale, Translation } from './types';
import { en } from './en';
import { id } from './id';

export const translations: Record<Locale, Translation> = { en, id };
