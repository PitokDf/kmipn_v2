import { io } from "socket.io-client"
const token = typeof window !== "undefined" && localStorage.getItem("accessToken")
const socket = io(
    process.env.NEXT_PUBLIC_API_URL, {
    transports: ["websocket"],
    withCredentials: true,
    auth: {
        token
    }
}
)

export default socket