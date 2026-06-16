import bcrypt from "bcryptjs";

export const updateProfile = async (
  db: D1Database,
  user_id: string,
  data: { firstname?: string; lastname?: string; phone_no?: string }
) => {
  await db
    .prepare(
      `UPDATE users SET firstname = COALESCE(?, firstname), lastname = COALESCE(?, lastname),
       phone_no = COALESCE(?, phone_no), updated_at = CURRENT_TIMESTAMP
       WHERE user_id = ?`
    )
    .bind(data.firstname ?? null, data.lastname ?? null, data.phone_no ?? null, user_id)
    .run();

  return { success: true, message: "Profile updated" };
};

export const updateOrganization = async (
  db: D1Database,
  organization_id: string,
  data: { name?: string; email?: string; phone_no?: string }
) => {
  await db
    .prepare(
      `UPDATE organizations SET name = COALESCE(?, name), email = COALESCE(?, email),
       phone_no = COALESCE(?, phone_no), updated_at = CURRENT_TIMESTAMP
       WHERE organization_id = ?`
    )
    .bind(data.name ?? null, data.email ?? null, data.phone_no ?? null, organization_id)
    .run();

  return { success: true, message: "Organization updated" };
};

export const changePassword = async (
  db: D1Database,
  user_id: string,
  data: { current_password: string; new_password: string }
) => {
  const user = await db
    .prepare("SELECT password FROM users WHERE user_id = ?")
    .bind(user_id)
    .first<{ password: string }>();

  if (!user) throw new Error("User not found");

  const match = await bcrypt.compare(data.current_password, user.password);
  if (!match) throw new Error("Current password is incorrect");

  const hashed = await bcrypt.hash(data.new_password, 10);

  await db
    .prepare("UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?")
    .bind(hashed, user_id)
    .run();

  return { success: true, message: "Password changed" };
};
