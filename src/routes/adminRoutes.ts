import { Router } from "express";

import {
  getAllUsers,
  changeUserRole,
  deleteUser,
  getAllPosts,
  updateAnyPost,
  toggleAnyPostPublish,
  deleteAnyPost,
  getAllComments,
  deleteAnyComment,
} from "../controllers/adminController.js";

import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/authorizeMiddleware.js";

const router = Router();

router.use(authenticateToken);
router.use(authorizeRole("ADMIN"));

// USER MANAGEMENT
router.get("/users", getAllUsers);
router.patch("/users/:id/role", changeUserRole);
router.delete("/users/:id", deleteUser);

// POST MANAGEMENT
router.get("/posts", getAllPosts);
router.patch("/posts/:id", updateAnyPost);
router.patch("/posts/:id/publish", toggleAnyPostPublish);
router.delete("/posts/:id", deleteAnyPost);

// COMMENT MANAGEMENT
router.get("/comments", getAllComments);
router.delete("/comments/:id", deleteAnyComment);

export default router;