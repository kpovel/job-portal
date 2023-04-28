import { compare, hash } from "bcrypt";
import jwt, { type JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { env } from "~/env.mjs";

dotenv.config();

const saltRounds = 10;
const jwtSecret = env.JWT_SECRET;

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, saltRounds);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, jwtSecret) as JwtPayload;
  } catch (error) {
    return null;
  }
}
