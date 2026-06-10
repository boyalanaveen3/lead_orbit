import { Hono } from "hono";
import { authMiddleware } from "../middlerware/auth";
import { dashboard } from "../controller/dashboard.controller";
import { Env } from "../types";

const dashboardRouter = new Hono<{ Bindings: Env }>();

dashboardRouter.use("*", authMiddleware);

dashboardRouter.get("/dashboard", dashboard);

export default dashboardRouter;
