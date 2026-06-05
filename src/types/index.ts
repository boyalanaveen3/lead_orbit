export type Env = {
  DB: D1Database;
  JWT_SECRET: string;
};

export type UserPayload = {
  user_id: string;
  email: string;
  organization_id: string;
};
