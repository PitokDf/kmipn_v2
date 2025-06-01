import { useEffect, useRef } from 'react'
import { Socket } from 'socket.io-client'
import { toast } from 'sonner'

type User = {
    id: string
    // tambahin properti lain kalau perlu
}

export const useSocketRegister = (socket: Socket | undefined, user: User | null) => {
    const registered = useRef(false)

    useEffect(() => {
        if (!socket) return

        const handleConnect = () => {
            if (user?.id && !registered.current) {
                socket.emit('register', { userId: user.id })
                registered.current = true
                // console.log('✅ User registered on socket:', user.id)
                toast.success("terhubung kembali")
            }
        }

        const handleDisconnect = () => {
            registered.current = false
            // console.log('⚠️ Socket disconnected')
            toast.error("terputus dari internet")
        }

        socket.on('connect', handleConnect)
        socket.on('disconnect', handleDisconnect)

        // cleanup
        return () => {
            socket.off('connect', handleConnect)
            socket.off('disconnect', handleDisconnect)
        }
    }, [socket, user?.id])
}
