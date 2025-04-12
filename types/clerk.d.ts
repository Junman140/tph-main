declare module "@clerk/nextjs/server" {
  export const authMiddleware: (options?: {
    publicRoutes?: string[];
    ignoredRoutes?: string[];
    beforeAuth?: (req: Request) => Promise<Response | void>;
    afterAuth?: (auth: any, req: Request) => Promise<Response | void>;
  }) => (req: Request) => Promise<Response>;
} 