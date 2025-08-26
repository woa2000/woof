// Extended date utilities for calendar and insights
export function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
export function subDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
}
export function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}
export function endOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
export function startOfWeek(date, startOnMonday = true) {
    const day = date.getDay();
    const diff = startOnMonday
        ? (day === 0 ? 6 : day - 1)
        : day;
    return subDays(date, diff);
}
export function endOfWeek(date, startOnMonday = true) {
    const startWeek = startOfWeek(date, startOnMonday);
    return addDays(startWeek, 6);
}
export function isSameDay(date1, date2) {
    return (date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate());
}
export function isSameMonth(date1, date2) {
    return (date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth());
}
export function daysBetween(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round((date2.getTime() - date1.getTime()) / oneDay);
}
export function formatDateRange(startDate, endDate, locale = 'pt-BR') {
    if (isSameDay(startDate, endDate)) {
        return startDate.toLocaleDateString(locale);
    }
    if (isSameMonth(startDate, endDate)) {
        return `${startDate.getDate()}-${endDate.getDate()} de ${startDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}`;
    }
    return `${startDate.toLocaleDateString(locale)} - ${endDate.toLocaleDateString(locale)}`;
}
export function getMonthName(monthIndex, locale = 'pt-BR') {
    const date = new Date();
    date.setMonth(monthIndex);
    return date.toLocaleDateString(locale, { month: 'long' });
}
export function getWeekdayName(dayIndex, locale = 'pt-BR') {
    const date = new Date();
    date.setDate(date.getDate() - date.getDay() + dayIndex);
    return date.toLocaleDateString(locale, { weekday: 'long' });
}
//# sourceMappingURL=date.js.map