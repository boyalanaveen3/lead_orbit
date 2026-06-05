import { Context } from "hono";
import { Env } from "../types";
import { userRoleRegister } from "../services/userRole.service";

export const userRole = async (c: Context<{ Bindings: Env }>) => {
  try {
    const data = await c.req.json();
    const result = await userRoleRegister(c.env.DB, data);
    return c.json(result, 201);
  } catch (error) {
    console.error("Error assigning role:", error);
    const message =
      error instanceof Error ? error.message : "user role not assigned";
    return c.json({ success: false, message }, 400);
  }
};
