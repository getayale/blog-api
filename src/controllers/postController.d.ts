import type { Request, Response } from "express";
export declare const createPost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getPublishedPosts: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getPostById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updatePost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deletePost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updatePostPublishStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getMyPosts: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=postController.d.ts.map