import { Hono } from "hono";
import { cors } from "hono/cors";
import { Env } from "./types";
import authRouter from "./router/auth.router";
import leadsRouter from "./router/leads.router";
import usersRouter from "./router/users.router";
import tasksRouter from "./router/tasks.router";
import dashboardRouter from "./router/dashboard.router";
import settingsRouter from "./router/settings.router";
import orgrouter from "./router/organization.router";

const app = new Hono<{ Bindings: Env }>();

app.use("*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

app.get("/health", (c) => c.json({ status: "ok" }));

app.route("/api/auth", authRouter);
app.route("/api/leads", leadsRouter);
app.route("/api/users", usersRouter);
app.route("/api/tasks", tasksRouter);
app.route("/api", dashboardRouter);
app.route("/api/settings", settingsRouter);
app.route("/api", orgrouter);

export default app;
