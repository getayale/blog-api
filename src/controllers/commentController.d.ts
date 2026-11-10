import type { Request, Response } from "express";
export declare const createComment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getComments: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateComment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteComment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=commentController.d.ts.map