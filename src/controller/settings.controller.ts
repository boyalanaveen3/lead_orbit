import { Context } from "hono";
import { updateProfile, updateOrganization, changePassword } from "../services/settings.service";
import { Env } from "../types";

export const profileUpdate = async (c: Context<{ Bindings: Env }>) => {
  try {
    const user = c.get("user" as never) as any;
    const data = await c.req.json();
    const result = await updateProfile(c.env.DB, user.user_id, data);
    return c.json(result);
  } catch (e: any) {
    return c.json({ success: false, message: e.message }, 400);
  }
};

export const orgUpdate = async (c: Context<{ Bindings: Env }>) => {
  try {
    const user = c.get("user" as never) as any;
    const data = await c.req.json();
    const result = await updateOrganization(c.env.DB, user.organization_id, data);
    return c.json(result);
  } catch (e: any) {
    return c.json({ success: false, message: e.message }, 400);
  }
};

export const passwordChange = async (c: Context<{ Bindings: Env }>) => {
  try {
    const user = c.get("user" as never) as any;
    const data = await c.req.json();
    const result = await changePassword(c.env.DB, user.user_id, data);
    return c.json(result);
  } catch (e: any) {
    return c.json({ success: false, message: e.message }, 400);
  }
};
