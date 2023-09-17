import { createContext } from "react";
import type { User } from "../dbSchema/user";

export const AuthContext = createContext<User | null>(null);
