import { Router } from "express";
import { createPost, deletePost, getMyPosts, getPostById, getPublishedPosts, updatePost, updatePostPublishStatus } from "../controllers/postController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/authorizeMiddleware.js";
const postsRouter = Router();
postsRouter.post("/", authenticateToken, authorizeRole("AUTHOR", "ADMIN"), createPost);
postsRouter.get("/", getPublishedPosts);
postsRouter.get("/mine", authenticateToken, authorizeRole("AUTHOR", "ADMIN"), getMyPosts);
postsRouter.get("/:id", getPostById);
postsRouter.put("/:id", authenticateToken, authorizeRole("AUTHOR", "ADMIN"), updatePost);
postsRouter.delete("/:id", authenticateToken, authorizeRole("AUTHOR", "ADMIN"), deletePost);
postsRouter.patch("/:id/publish", authenticateToken, authorizeRole("AUTHOR", "ADMIN"), updatePostPublishStatus);
export default postsRouter;
//# sourceMappingURL=postsRouter.js.map