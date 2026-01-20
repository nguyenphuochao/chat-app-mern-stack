import { chatService } from "@/services/chatService";
import type { ChatState } from "@/types/store";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => ({
            conversations: [],
            messages: {},
            activeConversationId: null,
            loading: false,

            reset: () => {
                set({
                    conversations: [],
                    messages: {},
                    activeConversationId: null,
                    loading: false,
                })
            },
            setActiveConversation: (id) => set({ activeConversationId: id }),
            fetchConversations: async () => {
                try {
                    set({ loading: true })
                    const { conversations } = await chatService.fetchConversations();
                    set({ conversations, loading: false });
                } catch (error) {
                    console.log(error);
                    toast.error("Lỗi khi lấy dữ liệu chat");
                } finally {
                    set({ loading: false })
                }
            }
        }),
        {
            name: "chat-storage",
            partialize: (state) => ({ conversations: state.conversations })
        }
    )
)