import { Context } from "hono";
import { createTask, getAllTasks } from "../services/tasks.service";
import { Env } from "../types";

export const addTask = async (c: Context<{ Bindings: Env }>) => {
  try {
    const data = await c.req.json();
    const result = await createTask(c.env.DB, data);
    return c.json(result, 201);
  } catch (e: any) {
    return c.json({ success: false, message: e.message }, 400);
  }
};

export const listTasks = async (c: Context<{ Bindings: Env }>) => {
  try {
    const user = c.get("user" as never) as any;
    const { page = 1, limit = 10 } = await c.req.json();
    const tasks = await getAllTasks(c.env.DB, user.user_id, Number(page), Number(limit));
    return c.json({ success: true, data: tasks });
  } catch (e: any) {
    return c.json({ success: false, message: e.message }, 500);
  }
};
