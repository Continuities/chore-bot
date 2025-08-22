export const withoutTime = (date: Date): Date => new Date(date.toDateString());
export const inDays = (date: Date, days: number): Date =>
	withoutTime(new Date(date.getTime() + days * 24 * 60 * 60 * 1000));
