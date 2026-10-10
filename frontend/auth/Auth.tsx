import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useApi } from "../api/ApiContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PlockLoader } from "../processingProvider/PlockLoader";

interface User {
    name: string;
}


type AuthState = { status: "loading" } | { status: "anonymous" } | { status: "authenticated"; user: User }

const AuthContext = createContext<{ state: AuthState; setUser: (u: User | null) => void } | null>(null)

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const api = useApi()
    const [state, setState] = useState<AuthState>({ status: "loading" })

    const setUser = useCallback((user: User | null) =>
        setState(user ? { status: "authenticated", user } : { status: "anonymous" }), [])

    useEffect(() => {
        // FIXME
        api.me().then(setUser).catch(() => setUser(null))
        // api.me().then(() => {setUser({name:"hej"})}).catch(() => setUser(null))
    }, [api, setUser])

    useEffect(() => api.onUnauthorized(() => setUser(null)), [api, setUser])

    return <AuthContext.Provider value={{ state, setUser }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used within AuthProvider")
    return ctx
}

export const RequireAuth: React.FC = () => {
    const { state } = useAuth()
    const location = useLocation()

    if (state.status === "loading") return <PlockLoader />
    if (state.status === "anonymous") {
        const next = location.pathname + location.search
        return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />
    }
    return <Outlet />
}
