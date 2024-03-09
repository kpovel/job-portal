import { createContext } from "react";
import type { UserDataClient } from "./useAuth";

export const AuthContext = createContext<UserDataClient | null>(null);
