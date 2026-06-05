export const getAllLeads = async (
  db: D1Database,
  organization_id: string
) => {
  const result = await db
    .prepare(
      `SELECT l.*, ls.name as status
       FROM leads l
       JOIN lead_status ls ON ls.status_id = l.status_id
       WHERE l.organization_id = ?
       ORDER BY l.created_at DESC`
    )
    .bind(organization_id)
    .all();

  return result.results;
};

export const getLeadById = async (
  db: D1Database,
  lead_id: string,
  organization_id: string
) => {
  return await db
    .prepare(
      "SELECT * FROM leads WHERE lead_id = ? AND organization_id = ?"
    )
    .bind(lead_id, organization_id)
    .first();
};

export const createLead = async (
  db: D1Database,
  organization_id: string,
  created_by: string,
  data: any
) => {
  if (!organization_id) {
    throw new Error("organization_id is required");
  }

  if (!created_by) {
    throw new Error("created_by is required");
  }

  if (!data.firstname?.trim()) {
    throw new Error("firstname is required");
  }

  if (!data.phone_no?.trim()) {
    throw new Error("phone_no is required");
  }

  const lead_id = crypto.randomUUID();

  await db
    .prepare(
      `INSERT INTO leads (lead_id, organization_id, assigned_to, status_id, firstname, lastname, email, phone_no, company_name, source, remarks, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      lead_id,
      organization_id,
      data.assigned_to ?? null,
      data.status_id ?? "status_new",
      data.firstname.trim(),
      data.lastname ?? null,
      data.email ?? null,
      data.phone_no.trim(),
      data.company_name ?? null,
      data.source ?? null,
      data.remarks ?? null,
      created_by
    )
    .run();

  return { success: true, lead_id };
};

export const updateLead = async (
  db: D1Database,
  lead_id: string,
  organization_id: string,
  data: any
) => {
  await db
    .prepare(
      `UPDATE leads
       SET assigned_to = ?, status_id = ?, firstname = ?, lastname = ?,
           email = ?, phone_no = ?, company_name = ?, source = ?, remarks = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE lead_id = ? AND organization_id = ?`
    )
    .bind(
      data.assigned_to ?? null,
      data.status_id,
      data.firstname,
      data.lastname ?? null,
      data.email ?? null,
      data.phone_no,
      data.company_name ?? null,
      data.source ?? null,
      data.remarks ?? null,
      lead_id,
      organization_id
    )
    .run();

  return { success: true, message: "Lead updated" };
};

export const deleteLead = async (
  db: D1Database,
  lead_id: string,
  organization_id: string
) => {
  await db
    .prepare(
      "DELETE FROM leads WHERE lead_id = ? AND organization_id = ?"
    )
    .bind(lead_id, organization_id)
    .run();

  return { success: true, message: "Lead deleted" };
};
