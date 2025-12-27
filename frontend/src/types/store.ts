import type { User } from "./user";

export interface AuthState {
    accessToken: String | null,
    user: User | null,
    loading: boolean,
    clearState: () => void,
    signUp: (firstName: String, lastName: String, username: String, email: String, password: String) => Promise<void>
    signIn: (username: String, password: String) => Promise<void>
    signOut: () => Promise<void>
    fetchMe: () => Promise<void>
    refresh: () => Promise<void>
}