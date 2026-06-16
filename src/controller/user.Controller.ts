import { Context } from "hono";
import { getUsers, addUser, updateUserStatus } from "../services/user.service";
import { Env } from "../types";

export const listUsers = async (c: Context<{ Bindings: Env }>) => {
  try {
    const user = c.get("user" as never) as any;
    const result = await getUsers(c.env.DB, user.organization_id);
    return c.json({ success: true, data: result });
  } catch (e: any) {
    return c.json({ success: false, message: e.message }, 500);
  }
};

export const createUser = async (c: Context<{ Bindings: Env }>) => {
  try {
    const user = c.get("user" as never) as any;
    const data = await c.req.json();
    const result = await addUser(c.env.DB, user.organization_id, data);
    return c.json(result, 201);
  } catch (e: any) {
    return c.json({ success: false, message: e.message }, 400);
  }
};

export const toggleUserStatus = async (c: Context<{ Bindings: Env }>) => {
  try {
    const user = c.get("user" as never) as any;
    const { is_active } = await c.req.json();
    const result = await updateUserStatus(c.env.DB, c.req.param("id"), user.organization_id, is_active);
    return c.json(result);
  } catch (e: any) {
    return c.json({ success: false, message: e.message }, 400);
  }
};
