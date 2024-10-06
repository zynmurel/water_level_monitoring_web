
export type UserRoles = "super-admin" | "admin" | "instructor"  | "student"   | "company"

export type CredentialsType = { username:string;  role:UserRoles ; id:number; department?:string, password?:string}
