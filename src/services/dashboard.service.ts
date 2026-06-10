export const getDashboardStats = async (
  db: D1Database,
  organization_id: string
) => {
  const [totalLeads, newLeads, pendingTasks, totalUsers] = await Promise.all([
    db
      .prepare("SELECT COUNT(*) as count FROM leads WHERE organization_id = ?")
      .bind(organization_id)
      .first<{ count: number }>(),
    db
      .prepare("SELECT COUNT(*) as count FROM leads WHERE organization_id = ? AND status_id = 'status_new'")
      .bind(organization_id)
      .first<{ count: number }>(),
    db
      .prepare("SELECT COUNT(*) as count FROM tasks WHERE status = 'pending'")
      .first<{ count: number }>(),
    db
      .prepare("SELECT COUNT(*) as count FROM users WHERE organization_id = ? AND is_active = 1")
      .bind(organization_id)
      .first<{ count: number }>(),
  ]);

  return {
    totalLeads: totalLeads?.count ?? 0,
    newLeads: newLeads?.count ?? 0,
    pendingTasks: pendingTasks?.count ?? 0,
    totalUsers: totalUsers?.count ?? 0,
  };
};
