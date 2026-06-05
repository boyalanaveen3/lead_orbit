import { Context } from "hono";
import {
  getAllLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
} from "../services/leads.service";
import { Env } from "../types";

export const listLeads = async (c: Context<{ Bindings: Env }>) => {
  const user = c.get("user" as never) as any;
  const leads = await getAllLeads(c.env.DB, user.organization_id);
  return c.json({ success: true, data: leads });
};

export const getLead = async (c: Context<{ Bindings: Env }>) => {
  const user = c.get("user" as never) as any;
  const id = c.req.param("id");
  if (!id) return c.json({ success: false, message: "id is required" }, 400);
  const lead = await getLeadById(c.env.DB, id, user.organization_id);
  if (!lead) return c.json({ success: false, message: "Lead not found" }, 404);
  return c.json({ success: true, data: lead });
};

export const addLead = async (c: Context<{ Bindings: Env }>) => {
  try {
    const user = c.get("user" as never) as any;
    if (!user?.user_id) {
      throw new Error("Invalid token: user_id missing");
    }
    if (!user?.organization_id) {
      throw new Error("Invalid token: organization_id missing, please login again");
    }

    const data = await c.req.json();
    const result = await createLead(c.env.DB, user.organization_id, user.user_id, data);
    return c.json(result, 201);
  } catch (e: any) {
    return c.json({ success: false, message: e.message }, 400);
  }
};

export const editLead = async (c: Context<{ Bindings: Env }>) => {
  try {
    const user = c.get("user" as never) as any;
    const data = await c.req.json();
    const id = c.req.param("id");
    if (!id) return c.json({ success: false, message: "id is required" }, 400);
    const result = await updateLead(c.env.DB, id, user.organization_id, data);
    return c.json(result);
  } catch (e: any) {
    return c.json({ success: false, message: e.message }, 400);
  }
};

export const removeLead = async (c: Context<{ Bindings: Env }>) => {
  const user = c.get("user" as never) as any;
  const id = c.req.param("id");
  if (!id) return c.json({ success: false, message: "id is required" }, 400);
  const result = await deleteLead(c.env.DB, id, user.organization_id);
  return c.json(result);
};
