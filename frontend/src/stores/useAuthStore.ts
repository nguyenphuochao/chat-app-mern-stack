import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    user: null,
    loading: false,

    clearState: () => { set({ accessToken: null, user: null, loading: false }) },

    signUp: async (firstName, lastName, username, email, password) => {
        try {
            set({ loading: true })
            // call api
            await authService.signUp(firstName, lastName, username, email, password);
            toast.success("Đăng ký thành công! Chuyển sang trang đăng nhập");
        } catch (error) {
            console.log(error);
            toast.error("Đăng ký không thành công");
        } finally {
            set({ loading: false })
        }
    },

    signIn: async (username, password) => {
        try {
            set({ loading: true })
            // call api
            await authService.signIn(username, password);
            const { accessToken } = await authService.signIn(username, password);
            set({ accessToken });

            // after sign in call fetchMe
            await get().fetchMe();

            toast.success("Đăng nhập thành công!");
        } catch (error) {
            console.log(error);
            toast.error("Đăng nhập không thành công");
        } finally {
            set({ loading: false })
        }
    },

    signOut: async () => {
        try {
            set({ loading: true })
            // call api
            await authService.signOut()
            get().clearState();
            toast.success("Đăng xuất thành công!");
        } catch (error) {
            console.log(error);
            toast.error("Đăng xuất không thành công");
        } finally {
            set({ loading: false })
        }
    },

    fetchMe: async () => {
        try {
            set({ loading: true })
            // call api
            const user = await authService.fetchMe();
            set({ user })
        } catch (error) {
            console.log(error);
            set({ user: null, accessToken: null });
            toast.error("Lỗi khi lấy dữ liệu người dùng");
        } finally {
            set({ loading: false })
        }
    },

    refresh: async () => {
        try {
            set({ loading: true })
            const { user, fetchMe } = get();
            // call api
            const accessToken = await authService.refresh();

            set({ accessToken })

            // after refresh call fetchMe
            if (!user) {
                await fetchMe();
                console.log(user);
            }
        } catch (error) {
            console.log(error);
            toast.error("Lỗi khi gọi refreshToken");
        } finally {
            set({ loading: false })
            get().clearState();
        }
    }
}))