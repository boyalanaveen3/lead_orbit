import { Hono } from "hono";
import { authMiddleware } from "../middlerware/auth";
import { listUsers, createUser, toggleUserStatus } from "../controller/user.Controller";
import { Env } from "../types";

const usersRouter = new Hono<{ Bindings: Env }>();

usersRouter.use("*", authMiddleware);

usersRouter.get("/", listUsers);
usersRouter.post("/", createUser);
usersRouter.patch("/:id/status", toggleUserStatus);

export default usersRouter;
