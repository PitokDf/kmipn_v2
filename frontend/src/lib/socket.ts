import { io } from "socket.io-client"
const token = typeof window !== "undefined" && localStorage.getItem("accessToken")
const socket = io(
    process.env.NEXT_PUBLIC_API_URL, {
    transports: ["websocket"],
    withCredentials: true,
    auth: { token },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000
}
)

export default socket