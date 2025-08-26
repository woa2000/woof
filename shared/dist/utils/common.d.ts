import { type ClassValue } from "clsx";
export declare function cn(...inputs: ClassValue[]): string;
export declare function formatDate(date: Date | string, locale?: string): string;
export declare function formatDateTime(date: Date | string, locale?: string): string;
export declare function isValidDate(date: any): boolean;
export declare function capitalize(str: string): string;
export declare function truncate(str: string, length: number): string;
export declare function slugify(str: string): string;
export declare function formatCurrency(amount: number, currency?: string, locale?: string): string;
export declare function formatNumber(num: number, locale?: string): string;
export declare function unique<T>(array: T[]): T[];
export declare function chunk<T>(array: T[], size: number): T[][];
export declare function omit<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
export declare function pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
//# sourceMappingURL=common.d.ts.map