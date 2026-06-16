import { Hono } from "hono";
import { authMiddleware } from "../middlerware/auth";
import { profileUpdate, orgUpdate, passwordChange } from "../controller/settings.controller";
import { Env } from "../types";

const settingsRouter = new Hono<{ Bindings: Env }>();

settingsRouter.use("*", authMiddleware);

settingsRouter.patch("/profile", profileUpdate);
settingsRouter.patch("/organization", orgUpdate);
settingsRouter.patch("/password", passwordChange);

export default settingsRouter;
