import { Router } from "express";
import { createComment, deleteComment, getComments, updateComment } from "../controllers/commentController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const commentsRouter = Router();
commentsRouter.post("/:postId", authenticateToken, createComment);
commentsRouter.get("/:postId", getComments);
commentsRouter.put("/:commentId", authenticateToken, updateComment);
commentsRouter.delete("/:commentId", authenticateToken, deleteComment);
export default commentsRouter;
//# sourceMappingURL=commentsRouter.js.map