import { createContext } from "react";
import type { User } from "dbSchema/models";

export const AuthContext = createContext<User | null>(null);
