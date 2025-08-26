export declare const SUPABASE_CONFIG: {
    readonly url: string;
    readonly anonKey: string;
};
export declare const AUTH_CONFIG: {
    readonly redirectTo: string;
    readonly cookieName: "sb-auth-token";
    readonly cookieOptions: {
        readonly maxAge: number;
        readonly httpOnly: true;
        readonly secure: boolean;
        readonly sameSite: "lax";
        readonly path: "/";
    };
};
//# sourceMappingURL=config.d.ts.map