import type { Locale } from "react-day-picker";
import { enUS, vi } from "react-day-picker/locale";

/**
 * The calendar's own locale registry, by language code.
 *
 * It lives here rather than in an app because a `Calendar` locale is a date-fns
 * `Locale` OBJECT, and `date-fns` is a dependency of this package only — it
 * arrives with `react-day-picker` and is deliberately not reachable from an app
 * (see .agents/rules/dates-dayjs-singleton.md). Re-exported through
 * `react-day-picker/locale` so the import names the library that consumes it.
 *
 * Keeping the registry by value, rather than importing `@medviet/i18n`, is the
 * same call `@medviet/dayjs` makes for its own locales: the package stays at the
 * foundation layer, and the app is the one layer that knows both.
 */
const CALENDAR_LOCALES: Record<string, Locale> = { vi, en: enUS };

const DEFAULT_CALENDAR_LOCALE = vi;

/**
 * The `Calendar`/`DatePickerInput` locale for a language code, falling back
 * deliberately rather than silently rendering English.
 *
 * Pass `i18n.resolvedLanguage`, never `i18n.language`: a browser reporting
 * "vi-VN" would miss this map entirely, which is the same trap
 * .agents/rules/dates-locale-render-input.md describes for dayjs. Matching on
 * the language half here covers a caller that hands over a region code anyway.
 */
export function calendarLocale(language: string | undefined): Locale {
  const code = language?.split("-")[0];
  if (!code) return DEFAULT_CALENDAR_LOCALE;
  return CALENDAR_LOCALES[code] ?? DEFAULT_CALENDAR_LOCALE;
}
