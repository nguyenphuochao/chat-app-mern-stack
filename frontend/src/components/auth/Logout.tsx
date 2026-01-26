import { Button } from '../ui/button'
import { useAuthStore } from '@/stores/useAuthStore'
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';

const Logout = () => {
    const navigate = useNavigate();
    const { signOut } = useAuthStore();

    const handleLogout = async () => {
        await signOut();
        navigate('/signin');
    }

    return (
        <Button variant="completeGhost" className="cursor-pointer" onClick={handleLogout}>
            <LogOut className='text-destructive' />
            Logout
        </Button>
    )
}

export default Logout