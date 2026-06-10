import { Hono } from "hono";
import { cors } from "hono/cors";
import { Env } from "./types";
import authRouter from "./router/auth.router";
import leadsRouter from "./router/leads.router";
import orgrouter from "./router/organization.router";
import userRoleRouter from "./router/userRole.router";
import dashboardRouter from "./router/dashboard.router";
import tasksRouter from "./router/tasks.router";

const app = new Hono<{ Bindings: Env }>();

app.use("*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

app.get("/health", (c) => c.json({ status: "ok" }));

app.route("/api/auth", authRouter);
app.route("/api/leads", leadsRouter);
app.route("/api", orgrouter);
app.route("/api", userRoleRouter);
app.route("/api/", dashboardRouter);
app.route("/api/tasks", tasksRouter);

export default app;
