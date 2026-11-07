import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken=(req:Request,res:Response,next:NextFunction)=>{
const authHeader=req.headers.authorization;
const token = authHeader && authHeader.split(" ")[1];

if(!token){
    return res.status(401).json({
        message:"Access denied. No token provided",
    });
}
try{
const decoded = jwt.verify(
  token,
  process.env.JWT_SECRET!
) as {
  userId: string;
  role: "AUTHOR" | "READER";
};

req.user = {
  userId: decoded.userId,
  role: decoded.role,
};

next();
}

catch(error){
    return res.status(401).json({
        message:"Invalid or expired token",
    })

}
}