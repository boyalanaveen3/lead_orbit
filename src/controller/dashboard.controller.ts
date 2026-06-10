import { Context } from "hono";
import { getDashboardStats } from "../services/dashboard.service";
import { Env } from "../types";

export const dashboard = async (c: Context<{ Bindings: Env }>) => {
  try {
    const user = c.get("user" as never) as any;
    const result = await getDashboardStats(c.env.DB, user.organization_id);
    return c.json({ success: true, data: result });
  } catch (e: any) {
    return c.json({ success: false, message: e.message }, 500);
  }
};
