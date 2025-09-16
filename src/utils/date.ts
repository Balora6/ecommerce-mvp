import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";

// Dubai timezone (UTC+4)
const DUBAI_TIMEZONE = "Asia/Dubai";

export function getLast30DaysRange(): { from: Date; to: Date } {
  const now = new Date();
  const to = endOfDay(now);
  const from = startOfDay(subDays(now, 29)); // 29 days ago + today = 30 days inclusive

  return { from, to };
}

export function formatDateForShopify(date: Date): string {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'");
}

export function formatDateForDisplay(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function convertToDubaiTime(date: Date): Date {
  return utcToZonedTime(date, DUBAI_TIMEZONE);
}

export function convertFromDubaiTime(date: Date): Date {
  return zonedTimeToUtc(date, DUBAI_TIMEZONE);
}
