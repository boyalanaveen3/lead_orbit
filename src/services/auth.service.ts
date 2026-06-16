import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt";

export const registerUser = async (
  db: D1Database,
  secret: string,
  data: {
    organization_name: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    phone_no: string;
  }
) => {
  if (!secret) throw new Error("JWT_SECRET is missing");

  const existing = await db
    .prepare("SELECT user_id FROM users WHERE email = ?")
    .bind(data.email)
    .first();

  if (existing) throw new Error("Email already registered");

  if (!data.organization_name?.trim()) throw new Error("Organization name is required");

  // create org
  const organization_id = crypto.randomUUID();
  await db
    .prepare(`INSERT INTO organizations (organization_id, name, phone_no) VALUES (?, ?, ?)`)
    .bind(organization_id, data.organization_name.trim(), data.phone_no)
    .run();

  // create user
  const user_id = crypto.randomUUID();
  const hashedPassword = await bcrypt.hash(data.password, 10);

  await db
    .prepare(
      `INSERT INTO users (user_id, organization_id, firstname, lastname, email, password, phone_no)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(user_id, organization_id, data.firstname, data.lastname, data.email, hashedPassword, data.phone_no)
    .run();

  // assign admin role
  await db
    .prepare(`INSERT INTO user_roles (user_id, role_id) VALUES (?, 'role_admin')`)
    .bind(user_id)
    .run();

  return { success: true, message: "Registered successfully" };
};

export const loginUser = async (
  db: D1Database,
  secret: string,
  data: { email: string; password: string }
) => {
  if (!secret) throw new Error("JWT_SECRET is missing");

  const user = await db
    .prepare(
      `SELECT u.*, r.name as role
       FROM users u
       JOIN user_roles ur ON ur.user_id = u.user_id
       JOIN roles r ON r.role_id = ur.role_id
       WHERE u.email = ? AND u.is_active = 1`
    )
    .bind(data.email)
    .first<any>();

  if (!user) throw new Error("Invalid Email");

  const match = await bcrypt.compare(data.password, user.password);
  if (!match) throw new Error("Invalid Password");

  const token = await generateToken(
    {
      user_id: user.user_id,
      email: user.email,
      organization_id: user.organization_id,
      role: user.role,
    },
    secret
  );

  return { success: true, token };
};
