import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { networkInterfaces } from "node:os"
import morgan from "morgan"
import { Server as SocketIOServer } from "socket.io"
import apiRoute from "./routes/index.routes"
import { env } from "./configs/env"
import http from "http"
import { socketHandler } from "./socket"
import path from "node:path"

dotenv.config()
const app = express()
const server = http.createServer(app)

export const io = new SocketIOServer(server, {
    cors: {
        origin: env.frontendUrl,
        credentials: true,
    },
})

const PORT: number = parseInt(process.env.PORT || "2003", 10)

app.use(express.json())
app.use(morgan("dev"))
app.use(cors({
    origin: env.frontendUrl,
    credentials: true
}))

app.use('/public', express.static(path.join(__dirname, '..', 'public')))

app.use("/api", apiRoute)
app.use('/', (req, res) => {
    return res.status(200).json({
        message: "Server running, keep ENJOYYY"
    })
})
socketHandler(io)

function getNetworkAdresses(): string[] {
    const nets = networkInterfaces();
    const results: string[] = []

    for (const name of Object.keys(nets)) {
        const netsInterface = nets[name]!;
        for (const net of netsInterface) {
            if (net.family === "IPv4" && !net.internal) {
                results.push(net.address)
            }
        }
    }
    return results
}

function startServer(port: number) {
    server.listen(port, () => {
        console.log(`• Server running on:`);
        console.log(`   Local:   http://localhost:${port}`);

        const addrs = getNetworkAdresses();
        if (addrs.length) {
            for (const addr of addrs) {
                console.log(`   Network: http://${addr}:${port}`);
            }
        }
    })

    server.on("error", (err: NodeJS.ErrnoException) => {
        if (err.code === "EADDRINUSE") {
            console.warn(`Port ${port} in use, trying ${port + 1}…`);
            startServer(port + 1)
        } else {
            console.error("Server error:", err);
        }
    })
}

startServer(PORT)
