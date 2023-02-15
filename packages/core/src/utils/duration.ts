import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const formatDuration = (milliseconds: number): string => {
  const dayJSduration = dayjs.duration(milliseconds, 'milliseconds');
  const nbDays = dayJSduration.get('hour');
  const nbMinutes = dayJSduration.get('minute');
  const dynamicFormats = [!!nbDays && 'H[h]', !!nbMinutes && 'm[m]'].filter(Boolean).join(' ');
  return dayJSduration.format(dynamicFormats);
};

export function parsePbDurationAsSeconds(s: string) {
  let f = s;
  if (s.endsWith('s')) {
    f = s.substring(0, s.length - 1);
  }
  return +f;
}

export function formatPbDuration(s: string) {
  const ms = 1000 * parsePbDurationAsSeconds(s);
  if (ms === 0) {
    return '-';
  }
  return formatDuration(ms);
}
