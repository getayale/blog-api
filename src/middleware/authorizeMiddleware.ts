
import type { Request, Response, NextFunction } from "express";

export const authorizeRole = (allowedRole: "READER" | "AUTHOR") => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (req.user.role !== allowedRole) {
      return res.status(403).json({
        message: "You do not have permission to perform this action",
      });
    }

    next();
  };
};
