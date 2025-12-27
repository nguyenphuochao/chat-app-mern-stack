import { useAuthStore } from "@/stores/useAuthStore"
import { useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router"

const ProtectedRoute = () => {

    const { accessToken, refresh, user, fetchMe, loading } = useAuthStore()
    const [stating, setStating] = useState(true)

    const init = async () => {
        // check refresh page (F5)
        if (!accessToken) {
            await refresh();
        }

        if (accessToken && !user) {
            await fetchMe();
        }

        setStating(false)
    }

    useEffect(() => {
        init();
    }, [])

    if (loading || stating) {
        return <div>Đang tải trang...</div>
    }

    if (!accessToken) {
        return <Navigate replace to="/signin" />
    }

    return (
        <Outlet></Outlet>
    )
}

export default ProtectedRoute