export const userRoleRegister = async (
  db: D1Database,
  data: {
    user_id: string;
    role: string;
  }
) => {

  const userId = data.user_id?.trim();
  const roleName = data.role?.trim().toLowerCase();

  if (!userId) {
    throw new Error("user_id is required");
  }

  if (!roleName) {
    throw new Error("role is required");
  }

  const user = await db
    .prepare(
      "SELECT user_id FROM users WHERE user_id = ?"
    )
    .bind(userId)
    .first();

  if (!user) {
    throw new Error("User not found");
  }

  await db
    .prepare(
      `
      INSERT OR IGNORE INTO roles (
        role_id,
        name
      )
      VALUES (?, ?)
      `
    )
    .bind(
      crypto.randomUUID(),
      roleName
    )
    .run();

  const role = await db
    .prepare(
      `
      SELECT role_id
      FROM roles
      WHERE name = ?
      `
    )
    .bind(roleName)
    .first<{ role_id: string }>();

  if (!role) {
    throw new Error("Role not found");
  }

  await db
    .prepare(
      `
      INSERT OR IGNORE INTO user_roles (
        user_id,
        role_id
      )
      VALUES (?, ?)
      `
    )
    .bind(
      userId,
      role.role_id
    )
    .run();

  return {
    success: true,
    message: "Role assigned successfully",
  };
};
/*
Request
  ↓

{
  user_id: "user123",
  role: "admin"
}

  ↓

Check user_id

  ↓

Check role

  ↓

Insert role if missing

  ↓

Get role_id

  ↓

Insert into user_roles

  ↓

Success
*/