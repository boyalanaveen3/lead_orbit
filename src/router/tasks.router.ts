import { Hono } from "hono";
import { authMiddleware } from "../middlerware/auth";
import { addTask, listTasks } from "../controller/tasks.controller";
import { Env } from "../types";

const tasksRouter = new Hono<{ Bindings: Env }>();

tasksRouter.use("*", authMiddleware);

tasksRouter.post("/add", addTask);
tasksRouter.post("/list", listTasks);

export default tasksRouter;
