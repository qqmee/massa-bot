import {
  format,
  formatDistanceStrict,
  formatDistanceToNowStrict,
} from 'date-fns';

export function yyyymmddhhmm(input: string | Date) {
  if (!input) return '-';
  return format(new Date(input), 'yyyy-MM-dd HH:mm');
}

export function ageDate(input: string | Date) {
  if (!input) return '-';
  return formatDistanceToNowStrict(new Date(input), { addSuffix: false });
}

export function distanceBetweenDate(d1: string | Date, d2: string | Date) {
  return formatDistanceStrict(new Date(d1), new Date(d2), { addSuffix: false });
}
