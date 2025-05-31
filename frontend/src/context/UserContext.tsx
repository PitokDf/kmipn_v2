'use client'

import { User } from '@/types/type'
import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext<User | null>(null)

export function useUser() {
    return useContext(UserContext)
}

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        if (typeof window !== "undefined") {
            const userStored: any = JSON.parse(localStorage.getItem("user")!)
            setUser(userStored)
        }
        // const getUserFromHeader = async () => {
        //     const res = await fetch('/api/user-context')

        //     if (res.ok) {
        //         const data = await res.json()
        //         setUser(data)
        //     }
        // }

        // getUserFromHeader()
    }, [])

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    )
}
