import Logout from '@/components/auth/Logout'
import { useAuthStore } from '@/stores/useAuthStore'

const ChatAppPage = () => {

  const user = useAuthStore((s) => s.user)

  return (
    <>
      <div className='username'>Xin chào: <span className='font-bold'>{ user?.username }</span></div>
      <Logout />
    </>
  )
}

export default ChatAppPage