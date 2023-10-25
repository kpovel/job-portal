import { createContext } from "react";
import type { User } from "dbSchema/models";

export const AuthContext = createContext<Omit<User, "password"> | null>(null);
