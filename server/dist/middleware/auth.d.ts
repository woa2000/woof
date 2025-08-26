import { Request, Response, NextFunction } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email?: string;
        [key: string]: any;
    };
    supabase?: SupabaseClient;
}
export declare function authenticateUser(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
export declare function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
export declare function requireAuth(): typeof authenticateUser;
export declare function createSupabaseServerClient(req: AuthenticatedRequest): SupabaseClient<any, "public", "public", any, any>;
//# sourceMappingURL=auth.d.ts.map