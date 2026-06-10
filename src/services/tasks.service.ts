export const createTask = async (db: D1Database, data: any) => {
  if (!data.title?.trim()) throw new Error("title is required");
  if (!data.assigned_to?.trim()) throw new Error("assigned_to is required");

  const task_id = crypto.randomUUID();

  await db
    .prepare(
      `INSERT INTO tasks (task_id, lead_id, assigned_to, title, description, due_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      task_id,
      data.lead_id ?? null,
      data.assigned_to,
      data.title.trim(),
      data.description ?? null,
      data.due_date ?? null,
      data.status ?? "pending"
    )
    .run();

  return { success: true, task_id };
};

export const getAllTasks = async (db: D1Database, assigned_to: string) => {
  const result = await db
    .prepare(
      `SELECT t.*, l.firstname as lead_firstname, l.lastname as lead_lastname
       FROM tasks t
       LEFT JOIN leads l ON l.lead_id = t.lead_id
       WHERE t.assigned_to = ?
       ORDER BY t.created_at DESC`
    )
    .bind(assigned_to)
    .all();

  return result.results;
};
