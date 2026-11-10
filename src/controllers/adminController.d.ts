import type { Request, Response } from "express";
export declare const getAllUsers: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const changeUserRole: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllPosts: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateAnyPost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const toggleAnyPostPublish: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteAnyPost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllComments: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteAnyComment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getDashboardStats: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=adminController.d.ts.map