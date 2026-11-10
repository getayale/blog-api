import type { Request, Response, NextFunction } from "express";
type Role = "ADMIN" | "AUTHOR" | "READER";
export declare const authorizeRole: (...allowedRoles: Role[]) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export {};
//# sourceMappingURL=authorizeMiddleware.d.ts.map