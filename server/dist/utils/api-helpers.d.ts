import { Response } from 'express';
export interface ApiError {
    message: string;
    code?: string;
    status?: number;
    details?: any;
}
export interface ApiResponse<T = any> {
    data?: T;
    error?: string;
    code?: string;
    details?: any;
    success: boolean;
    message?: string;
}
export declare function handleApiError(error: any, operation: string, res: Response): void;
export declare function sendSuccess<T>(res: Response, data: T, message?: string, status?: number): void;
export declare function sendCreated<T>(res: Response, data: T, message?: string): void;
export declare function validateSazonalidade(data: any): string[];
export declare function isValidDate(dateString: string): boolean;
export declare function isValidUUID(uuid: string): boolean;
export declare class ApiException extends Error {
    code: string;
    status: number;
    details?: any;
    constructor(message: string, code?: string, status?: number, details?: any);
}
//# sourceMappingURL=api-helpers.d.ts.map