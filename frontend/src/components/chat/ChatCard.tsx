import { Card } from "@/components/ui/card"
import { cn, formatOnlineTime } from "@/lib/utils";
import { useChatStore } from "@/stores/useChatStore";
import { MoreHorizontal, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface ChatCardProps {
    convoId: string;
    name: string;
    timestamp?: Date;
    isActive: boolean;
    onSelect: (id: string) => void;
    unreadCount?: number;
    leftSection: React.ReactNode;
    subtitle: React.ReactNode;
}

const ChatCard = ({
    convoId,
    name,
    timestamp,
    isActive,
    onSelect,
    unreadCount,
    leftSection,
    subtitle
}: ChatCardProps) => {

    const { deleteConversation } = useChatStore();

    const handleDeleteConversation = async (convoId: string) => {
        if (confirm("Bạn chắc xóa cuộc trò chuyện này?")) {
            await deleteConversation(convoId);
            toast.success("Đã xóa cuộc trò chuyện")
        }
    }

    return (
        <Card
            key={convoId}
            className={cn("border-none p-3 cursor-pointer transition-smooth glass hover:bg-muted/30",
                isActive && "ring-2 ring-primar/50 bg-linear-to-tr from-primary-glow/10 to-primary-foreground"
            )}
            onClick={() => onSelect(convoId)}
        >
            <div className="flex items-center gap-3">
                <div className="relative">{leftSection}</div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className={cn("font-semibold text-sm truncate",
                            unreadCount && unreadCount > 0 && "text-foreground"
                        )}>
                            {name}
                        </h3>

                        <span className="text-xs text-muted-foreground">{timestamp ? formatOnlineTime(timestamp) : ""}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 flex-1 min-w-0">{subtitle}</div>
                        <div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <MoreHorizontal
                                        className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 hover:size-5 transition-smooth"
                                    />
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="start">
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem className="cursor-pointer">
                                            <div className="flex items-center gap-2" onClick={() => handleDeleteConversation(convoId)}>
                                                <div><Trash2Icon /></div>
                                                <p>Xóa đoạn chat</p>
                                            </div>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                    </div>
                </div>
            </div>
        </Card>
    )
}

export default ChatCard