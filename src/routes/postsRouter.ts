import { Router } from "express";
import { createPost, deletePost, getPostById, getPublishedPosts, updatePost, updatePostPublishStatus } from "../controllers/postController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/authorizeMiddleware.js";
const postsRouter=Router();

postsRouter.post("/",authenticateToken,authorizeRole("AUTHOR"),createPost);
postsRouter.get("/",getPublishedPosts);
postsRouter.get("/:id", getPostById);
postsRouter.put("/:id",authenticateToken,authorizeRole("AUTHOR"),updatePost);
postsRouter.delete("/:id",authenticateToken,authorizeRole("AUTHOR"),deletePost);
postsRouter.patch("/:id/publish",authenticateToken,authorizeRole("AUTHOR"),updatePostPublishStatus);

export default postsRouter;