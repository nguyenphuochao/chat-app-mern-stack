import type { User } from "./user";

export interface AuthState {
    accessToken: String | null,
    user: User | null,
    loading: boolean,
    setAccessToken: (accessToken: String) => void
    clearState: () => void,
    signUp: (firstName: String, lastName: String, username: String, email: String, password: String) => Promise<void>
    signIn: (username: String, password: String) => Promise<void>
    signOut: () => Promise<void>
    fetchMe: () => Promise<void>
    refresh: () => Promise<void>
}

export interface ThemeStore {
    isDark: boolean,
    toggleTheme: () => void,
    setTheme: (dark: boolean) => void
}