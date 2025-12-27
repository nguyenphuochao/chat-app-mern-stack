import api from "@/lib/axios"

export const authService = {
    signUp: async (
        firstName: String,
        lastName: String,
        username: String,
        email: String,
        password: String
    ) => {
        const res = await api.post('/auth/signup', { firstName, lastName, username, email, password }, { withCredentials: true });
        return res.data
    },

    signIn: async (
        username: String,
        password: String
    ) => {
        const res = await api.post('/auth/signin', { username, password }, { withCredentials: true });
        return res.data // accessToken
    },

    signOut: async () => {
        return api.post('/auth/signout', { withCredentials: true });
    },

    fetchMe: async () => {
        const res = await api.get("/users/me", { withCredentials: true });
        return res.data.user
    },

    refresh: async () => {
        const res = await api.post("/auth/refresh", { withCredentials: true });
        return res.data.accessToken
    }
}