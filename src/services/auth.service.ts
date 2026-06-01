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
  }
) => {
  if (!secret) {
    throw new Error("JWT_SECRET is missing");
  }

  const existing = await db
    .prepare("SELECT user_id FROM users WHERE email = ?")
    .bind(data.email)
    .first();

  if (existing) {
    throw new Error("Email already registered");
  }

  if (!data.organization_name?.trim()) {
    throw new Error("Organization name is required");
  }

  let organization = await db
    .prepare("SELECT organization_id FROM organizations WHERE name = ?")
    .bind(data.organization_name.trim())
    .first<{ organization_id: string }>();

  if (!organization) {
    const organization_id = crypto.randomUUID();
    await db
      .prepare(
        `INSERT INTO organizations (organization_id, name)
         VALUES (?, ?)`
      )
      .bind(organization_id, data.organization_name.trim())
      .run();

    organization = { organization_id };
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  await db
    .prepare(
      `INSERT INTO users (user_id, organization_id, firstname, lastname, email, password)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(
      crypto.randomUUID(),
      organization.organization_id,
      data.firstname,
      data.lastname,
      data.email,
      hashedPassword
    )
    .run();

  return { success: true, message: "User Registered" };
};

export const loginUser = async (
  db: D1Database,
  secret: string,
  data: { email: string; password: string }
) => {
  if (!secret) {
    throw new Error("JWT_SECRET is missing");
  }

  const user = await db
    .prepare("SELECT * FROM users WHERE email = ?")
    .bind(data.email)
    .first<any>();

  if (!user) {
    throw new Error("Invalid Email");
  }

  const match = await bcrypt.compare(data.password, user.password);

  if (!match) {
    throw new Error("Invalid Password");
  }

  const token = await generateToken(
    { user_id: user.user_id, email: user.email },
    secret
  );

  return { success: true, token };
};
