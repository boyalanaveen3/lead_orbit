import { sign, verify } from "hono/jwt";
import { UserPayload } from "../types";

export const generateToken = async (
  payload: UserPayload,
  secret: string
) => {
  return await sign(payload, secret);
};

export const verifyToken = async (
  token: string,
  secret: string
) => {
  return await verify(token, secret, "HS256") as UserPayload;
};
