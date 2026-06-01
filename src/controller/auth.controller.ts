import { Context } from "hono";
import { registerUser, loginUser } from "../services/auth.service";
import { Env } from "../types";

export const register = async (c: Context<{ Bindings: Env }>) => {
  try {
    const data = await c.req.json();
    const result = await registerUser(c.env.DB, c.env.JWT_SECRET, data);
    return c.json(result, 201);
  } catch (e: any) {
    return c.json({ success: false, message: e.message }, 400);
  }
};

export const login = async (c: Context<{ Bindings: Env }>) => {
  try {
    const data = await c.req.json();
    const result = await loginUser(c.env.DB, c.env.JWT_SECRET, data);
    return c.json(result);
  } catch (e: any) {
    return c.json({ success: false, message: e.message }, 401);
  }
};
