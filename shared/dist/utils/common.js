import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
// Date utilities
export function formatDate(date, locale = 'pt-BR') {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString(locale);
}
export function formatDateTime(date, locale = 'pt-BR') {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString(locale);
}
export function isValidDate(date) {
    return date instanceof Date && !isNaN(date.getTime());
}
// String utilities
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
export function truncate(str, length) {
    return str.length > length ? `${str.slice(0, length)}...` : str;
}
export function slugify(str) {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}
// Number utilities
export function formatCurrency(amount, currency = 'BRL', locale = 'pt-BR') {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
    }).format(amount);
}
export function formatNumber(num, locale = 'pt-BR') {
    return new Intl.NumberFormat(locale).format(num);
}
// Array utilities
export function unique(array) {
    return [...new Set(array)];
}
export function chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}
// Object utilities
export function omit(obj, keys) {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
}
export function pick(obj, keys) {
    const result = {};
    keys.forEach(key => {
        if (key in obj)
            result[key] = obj[key];
    });
    return result;
}
//# sourceMappingURL=common.js.map