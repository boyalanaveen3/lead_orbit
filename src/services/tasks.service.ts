export const createTask = async (db: D1Database, data: any,) => {
  if (!data.title?.trim()) throw new Error("title is required");
  if (!data.assigned_to?.trim()) throw new Error("assigned_to is required");
  if (!data.lead_id?.trim()) throw new Error("lead_id is required");

  // lookup user_id from users by firstname + lastname
  const user = await db
    .prepare(`SELECT user_id FROM users WHERE LOWER(firstname) = LOWER(?)`)
    .bind(data.assigned_to.trim())
    .first<{ user_id: string }>();

  if (!user) throw new Error("Assigned user not found");

  // lookup lead_id from leads by firstname
  const lead = await db
    .prepare(`SELECT lead_id FROM leads WHERE LOWER(firstname) = LOWER(?)`)
    .bind(data.lead_id.trim())
    .first<{ lead_id: string }>();

  if (!lead) throw new Error("Lead not found");

  const task_id = crypto.randomUUID();

  await db
    .prepare(
      `INSERT INTO tasks (task_id, lead_id, assigned_to, title, description, due_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      task_id,
      lead.lead_id,
      user.user_id,
      data.title.trim(),
      data.description ?? null,
      data.due_date ?? null,
      data.status ?? "pending"
    )
    .run();

  return { success: true, task_id };
};

export const getAllTasks = async (
  db: D1Database,
  assigned_to: string,
  page: number,
  limit: number
) => {
  const offset = (page - 1) * limit;

  const [result, countResult] = await Promise.all([
    db
      .prepare(
        `SELECT t.*, l.firstname as lead_firstname, l.lastname as lead_lastname
         FROM tasks t
         LEFT JOIN leads l ON l.lead_id = t.lead_id
         WHERE t.assigned_to = ?
         ORDER BY t.created_at DESC
         LIMIT ${limit} OFFSET ${offset}`
      )
      .bind(assigned_to)
      .all(),
    db
      .prepare("SELECT COUNT(*) as count FROM tasks WHERE assigned_to = ?")
      .bind(assigned_to)
      .first<{ count: number }>(),
  ]);

  return {
    data: result.results,
    total: countResult?.count ?? 0,
    page,
    limit,
  };
};
