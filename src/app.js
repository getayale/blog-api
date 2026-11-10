import express from "express";
import cors from "cors";
import prisma from "./config/prisma.js";
import authRouter from "./routes/authRouter.js";
import { authenticateToken } from "./middleware/authMiddleware.js";
import { authorizeRole } from "./middleware/authorizeMiddleware.js";
import postsRouter from "./routes/postsRouter.js";
import commentsRouter from "./routes/commentsRouter.js";
import adminRouter from "./routes/adminRoutes.js";
import cookieParser from "cookie-parser";
const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:4200",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Blog API",
    });
});
app.get("/health/db", async (req, res) => {
    try {
        await prisma.$queryRaw `SELECT 1`;
        res.json({
            status: "success",
            message: "Database connection successful",
        });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: "Database connection failed",
        });
    }
});
app.get("/api/protected", authenticateToken, (req, res) => {
    res.json({
        message: "You have accessed a protected route!",
        user: req.user,
    });
});
app.get("/api/author-dashboard", authenticateToken, authorizeRole("AUTHOR"), (req, res) => {
    res.json({
        message: "Welcome to the author dashboard!",
        user: req.user,
    });
});
app.use("/api/posts", postsRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/admin", adminRouter);
export default app;
//# sourceMappingURL=app.js.map