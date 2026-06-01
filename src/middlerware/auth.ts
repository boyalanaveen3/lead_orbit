import { Context, Next } from "hono";
import { verifyToken } from "../utils/jwt";
import { Env } from "../types";

export const authMiddleware = async (
  c: Context<{ Bindings: Env }>,
  next: Next
) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ success: false, message: "Unauthorized" }, 401);
  }

  try {
    const token = authHeader.slice(7);
    const payload = await verifyToken(token, c.env.JWT_SECRET);
    c.set("user" as never, payload);
    await next();
  } catch {
    return c.json({ success: false, message: "Invalid token" }, 401);
  }
};
