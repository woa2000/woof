export declare const API_BASE_URL: string;
export declare const API_ENDPOINTS: {
    readonly auth: {
        readonly login: "/api/auth/login";
        readonly logout: "/api/auth/logout";
        readonly refresh: "/api/auth/refresh";
        readonly profile: "/api/auth/profile";
    };
    readonly calendario: {
        readonly base: "/api/calendario";
        readonly insights: "/api/calendario/insights";
        readonly sugestoes: "/api/calendario/sugestoes";
        readonly presets: "/api/calendario/presets";
        readonly byId: (id: string) => string;
    };
    readonly anamnese: {
        readonly base: "/api/anamnese";
        readonly digital: "/api/anamnese/digital";
        readonly reports: "/api/anamnese/reports";
        readonly byId: (id: string) => string;
    };
    readonly brands: {
        readonly base: "/api/brands";
        readonly manuals: "/api/brands/manuals";
        readonly upload: "/api/brands/upload";
        readonly byId: (id: string) => string;
    };
    readonly health: "/api/health";
    readonly upload: "/api/upload";
};
export declare const HTTP_METHODS: {
    readonly GET: "GET";
    readonly POST: "POST";
    readonly PUT: "PUT";
    readonly PATCH: "PATCH";
    readonly DELETE: "DELETE";
};
export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly INTERNAL_SERVER_ERROR: 500;
};
export declare const API_CONFIG: {
    readonly timeout: 10000;
    readonly retries: 3;
    readonly retryDelay: 1000;
    readonly headers: {
        readonly 'Content-Type': "application/json";
        readonly Accept: "application/json";
    };
};
//# sourceMappingURL=api.d.ts.map