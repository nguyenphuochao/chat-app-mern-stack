import Logout from '@/components/auth/Logout'
import { Button } from '@/components/ui/button'
import api from '@/lib/axios'
import { useAuthStore } from '@/stores/useAuthStore'

const ChatAppPage = () => {

  const user = useAuthStore((s) => s.user)

  const handleTest = async () => {
    try {
      await api.get("/users/test", { withCredentials: true });
      console.log("OK");
    } catch (error) {
      console.log("Error");
    }
  }

  return (
    <>
      <div className='username'>Xin chào: <span className='font-bold'>{ user?.username }</span></div>
      <Logout />
      <Button onClick={handleTest}>Test</Button>
    </>
  )
}

export default ChatAppPage