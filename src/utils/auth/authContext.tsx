import { createContext } from "react";
import type { User } from ".prisma/client";

export const AuthContext = createContext<User | null>(null);
