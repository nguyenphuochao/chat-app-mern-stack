import { friendService } from "@/services/friendService";
import type { FriendState } from "@/types/store";
import { toast } from "sonner";
import { create } from "zustand";

export const useFriendStore = create<FriendState>((set, get) => ({
    loading: false,
    receivedList: [],
    sentList: [],
    searchByUsername: async (username) => {
        try {
            set({ loading: true })
            const user = await friendService.searchByUsername(username);
            return user;
        } catch (error) {
            console.log("Lỗi xảy ra khi tìm user bằng username:", error);
            return null;
        } finally {
            set({ loading: false })
        }
    },

    addFriend: async (to, message) => {
        try {
            set({ loading: true })
            const resultMessage = await friendService.sendFriendRequest(to, message);
            return resultMessage;
        } catch (error) {
            console.log("Lỗi xảy ra khi tìm add friend:", error);
            return "Lỗi xảy ra khi gửi kết bạn!";
        } finally {
            set({ loading: false })
        }
    },

    getAllFriendRequests: async () => {
        try {
            set({ loading: true })
            const result = await friendService.getAllFriendRequest();
            if (!result) return;
            const { received, sent } = result;
            set({ receivedList: received, sentList: sent });
        } catch (error) {
            console.log("Lỗi xảy ra khi gọi getAllFriendRequests", error);
        } finally {
            set({ loading: false })
        }
    },

    acceptRequest: async (requestId) => {
        try {
            set({ loading: true })
            const result = await friendService.acceptRequest(requestId);
            if (!result) return;

            set((state) => ({
                receivedList: state.receivedList.filter((r) => r._id !== requestId)
            }))

            const { message } = result;
            toast.success(message)
        } catch (error) {
            console.log("Lỗi xảy ra khi gọi acceptRequest", error);
        } finally {
            set({ loading: false })
        }
    },

    declineRequest: async (requestId) => {
        try {
            set({ loading: true })
            await friendService.declineRequest(requestId);
            toast.success("Đã hủy lời mời kết bạn!")
            set((state) => ({
                receivedList: state.receivedList.filter((r) => r._id !== requestId)
            }))
        } catch (error) {
            console.log("Lỗi xảy ra khi gọi declineRequest", error);
        } finally {
            set({ loading: false })
        }
    }

}))