import { Hono } from "hono";
import { Env } from "../types";
import { userRole } from "../controller/user.Controller";

const userRouter = new Hono<{ Bindings: Env }>();
userRouter.post("/userRole", userRole);

export default userRouter;
