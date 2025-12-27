import { Button } from '../ui/button'
import { useAuthStore } from '@/stores/useAuthStore'
import { useNavigate } from 'react-router';

const Logout = () => {
    const navigate = useNavigate();
    const { signOut } = useAuthStore();

    const handleLogout = async () => {
        await signOut();
        navigate('/signin');
    }

    return (
        <Button className="cursor-pointer" onClick={handleLogout}>Logout</Button>
    )
}

export default Logout