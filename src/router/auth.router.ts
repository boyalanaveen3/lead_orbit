import { Hono } from "hono";
import { register, login } from "../controller/auth.controller";
import { Env } from "../types";

const authRouter = new Hono<{ Bindings: Env }>();

authRouter.post("/register", register);
authRouter.post("/login", login);

export default authRouter;
