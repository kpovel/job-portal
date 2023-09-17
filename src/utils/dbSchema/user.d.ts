import type { UserType } from "./userType"

export type User = {
  id: string
  userType: UserType
  lastName: string | null
  firstName: string | null
  middleName: string | null
  age: string | null
  phoneNumber: string | null
  email: string | null
  linkedinLink: string | null
  githubLink: string | null
  telegramLink: string | null
  login: string
  password: string
}

