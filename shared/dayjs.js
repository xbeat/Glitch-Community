import dayjs from 'dayjs';

export * from 'dayjs';

export default dayjs;

export function convertTime(amount, from, to) {
  const now = dayjs();
  return now.add(amount, from).diff(now, to);
}