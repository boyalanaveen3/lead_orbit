import { Hono } from "hono";
import { Env } from "./types";
import authRouter from "./router/auth.router";
import leadsRouter from "./router/leads.router";
import orgrouter from "./router/organization.router";
import userRoleRouter from "./router/userRole.router";

const app = new Hono<{ Bindings: Env }>();

app.get("/health", (c) => c.json({ status: "ok" }));

app.route("/api/auth", authRouter);
app.route("/api/leads", leadsRouter);
app.route ("/api",orgrouter);
app.route("/api", userRoleRouter);


export default app;
