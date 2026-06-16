import bcrypt from "bcryptjs";

export const getUsers = async (db: D1Database, organization_id: string) => {
  const result = await db
    .prepare(
      `SELECT u.user_id, u.firstname, u.lastname, u.email, u.phone_no, u.is_active, r.name as role
       FROM users u
       JOIN user_roles ur ON ur.user_id = u.user_id
       JOIN roles r ON r.role_id = ur.role_id
       WHERE u.organization_id = ?
       ORDER BY u.created_at DESC`
    )
    .bind(organization_id)
    .all();

  return result.results;
};

export const addUser = async (
  db: D1Database,
  organization_id: string,
  data: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    phone_no: string;
    role: string;
  }
) => {
  const existing = await db
    .prepare("SELECT user_id FROM users WHERE email = ?")
    .bind(data.email)
    .first();

  if (existing) throw new Error("Email already registered");

  const role = await db
    .prepare("SELECT role_id FROM roles WHERE LOWER(name) = LOWER(?)")
    .bind(data.role)
    .first<{ role_id: string }>();

  if (!role) throw new Error("Invalid role. Use admin, manager or employee");

  const user_id = crypto.randomUUID();
  const hashedPassword = await bcrypt.hash(data.password, 10);

  await db
    .prepare(
      `INSERT INTO users (user_id, organization_id, firstname, lastname, email, password, phone_no)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(user_id, organization_id, data.firstname, data.lastname, data.email, hashedPassword, data.phone_no)
    .run();

  await db
    .prepare("INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)")
    .bind(user_id, role.role_id)
    .run();

  return { success: true, user_id };
};

export const updateUserStatus = async (
  db: D1Database,
  user_id: string,
  organization_id: string,
  is_active: number
) => {
  await db
    .prepare(
      "UPDATE users SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND organization_id = ?"
    )
    .bind(is_active, user_id, organization_id)
    .run();

  return { success: true, message: is_active ? "User activated" : "User deactivated" };
};
