import { useFriendStore } from '@/stores/useFriendStore'
import FriendRequestItem from './FriendRequestItem';
import { Button } from "@/components/ui/button"
import { toast } from 'sonner';

const ReceivedRequests = () => {
  const { receivedList, acceptRequest, declineRequest, loading } = useFriendStore();

  console.log(receivedList);

  if (!receivedList || receivedList.length === 0) {
    return (
      <p className='text-sm text-muted-foreground'>Bạn chưa nhận lời mời kết bạn nào !</p>
    )
  }

  const handleAccept = async (requestId: string) => {
    try {
      await acceptRequest(requestId);
      toast.success("Đã nhận lời mời kết bạn thành công!");
    } catch (error) {
      console.log(error);
    }
  }

  const handleDecline = async (requestId: string) => {
    try {
      await declineRequest(requestId);
      toast.success("Đã từ chối lời mời kết bạn!");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='space-y-3 mt-4'>
      <>
        {receivedList.map((req) => (
          <FriendRequestItem
            key={req._id}
            requestInfo={req}
            type='received'
            actions={
              <div className='flex gap-2'>
                <Button size="sm" variant="outline" disabled={loading} onClick={() => handleAccept(req._id)}>Đồng ý</Button>
                <Button variant="destructive" disabled={loading} onClick={() => handleDecline(req._id)}>Từ chối</Button>
              </div>
            }
          />
        ))}
      </>
    </div>
  )
}

export default ReceivedRequests