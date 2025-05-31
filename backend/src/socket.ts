import { Server, Socket } from "socket.io";
import jwt from 'jsonwebtoken'
import { env } from "./configs/env";

const connectedUsers: Record<string, Socket> = {}
interface payloadJWT {
    email: string
    id: string
    name: string
    role: string
    teamDataCompleate: boolean
    verified: boolean
}

export function socketHandler(io: Server) {
    io.use((socket, next) => {
        const token = socket.handshake.auth.token
        // console.log(token);

        if (!token) {
            return next(new Error("No token provided"))
        }

        try {
            const decode = jwt.verify(token, env.jwtSecret!) as payloadJWT
            socket.data.user = decode
            next()
        } catch (error) {
            console.log("❌ Invalid token");
            return next(new Error("Unauthorized"))
        }
    })

    io.on("connection", (socket) => {
        const user = socket.data.user as payloadJWT

        if (user.role === 'admin') {
            socket.join("admins")
            console.log(`🔐 ${user.id} joined admin room`)
        } else {
            console.log(`👤 ${user.id} connected but not admin`)
        }
        // console.log('User connected', socket.id);
        // menerima info user dan disimpan ke map
        socket.on("register", (data: { userId: string }) => {
            connectedUsers[data.userId] = socket
            console.log("🟢 Registered user:", data.userId)
            console.log("🔗 Total connected users:", Object.keys(connectedUsers))
        })

        socket.on("disconnect", () => {
            const userId = Object.keys(connectedUsers).find(uid => connectedUsers[uid] === socket)
            if (userId) {
                delete connectedUsers[userId]
                console.log(`User ${userId} disconnect`)
            }
        })
    })
}

export function emitToUser(userId: string, event: string, payload: any) {
    const socket = connectedUsers[userId]
    if (socket) {
        socket.emit(event, payload)
    }
}

export function emitToAdmin(event: string, payload: any) {
    Object.entries(connectedUsers).forEach(([userId, socket]) => {
        const user = socket.data.user
        if (user.role === "admin") {
            socket.emit(event, payload)
        }
    })
}