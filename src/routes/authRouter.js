import { Router } from "express";
import { loginUser, logoutUser, registerUser, getCurrentUser } from "../controllers/authController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
const authRouter = Router();
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);
authRouter.get("/me", authenticateToken, getCurrentUser);
export default authRouter;
//# sourceMappingURL=authRouter.js.map