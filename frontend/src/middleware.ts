import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken"
import { jwtVerify } from "jose"
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { User } from "./types/type";


const SECRET_KEY = process.env.JWT_SECRET || ""
const encoder = new TextEncoder()
const secret = encoder.encode(SECRET_KEY)
const allowedPathByRole: { [key: string]: string[] } = {
    "participant": [
        "/participant",
        "/participant/team",
        "/participant/complete-team",
        "/participant/proposal"
    ],
    "admin": [
        "/admin",
        "/admin/categories",
        "/admin/proposals",
        "/admin/submission",
        "/admin/teams",
        "/admin/users",
    ],
    "operator": [
        "/admin",
        "/admin/categories",
        "/admin/teams/proposal",
        "/admin/teams/submission",
        "/admin/teams"
    ]
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get("accessToken")?.value

    // const token: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
        // jika user mengakses halaman login, biarkan mereka di halaman tersebut
        if (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register")) {
            return NextResponse.next();
        }
        // jika user belum login, arahkan ke halaman login
        return NextResponse.redirect(new URL("/auth/login", req.nextUrl))
    }

    try {
        const { payload } = await jwtVerify(token, secret, {
            algorithms: ['HS256'],
        })

        const requestHeaders = new Headers(req.headers)
        requestHeaders.set('x-user-data', Buffer.from(JSON.stringify(payload)).toString("base64"))
        const roleUser: any = payload.role;
        const teamDataCompleate = payload.teamDataCompleate;

        // req.headers.set("Authorization", `Bearer ${token.accessToken}`);

        if (roleUser === "admin" || roleUser === "operator") {
            if (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register")) {
                return NextResponse.redirect(new URL("/admin", req.nextUrl))
            }
        } else if (roleUser === "participant") {
            if (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register")) {
                return NextResponse.redirect(new URL("/participant", req.nextUrl))
            }
        }

        if (roleUser === "participant" && !teamDataCompleate) {
            if (pathname.startsWith("/participant/complete-team")) {
                return NextResponse.next();
            }

            return NextResponse.redirect(new URL(`/participant/complete-team`, req.nextUrl))
        } else {
            if (pathname.startsWith("/participant/complete-team")) {
                return NextResponse.redirect(new URL(`/participant`, req.nextUrl))
            }
        }

        const allowedPath = allowedPathByRole[roleUser] || [];
        if (!allowedPath.includes(req.nextUrl.pathname)) {
            return NextResponse.rewrite(new URL("/unauthorized", req.nextUrl))
        }

        return NextResponse.next({ request: { headers: requestHeaders, } })
    } catch (err) {
        console.error('Token tidak valid:', err)
        if (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register")) {
            return NextResponse.next();
        }

        return NextResponse.redirect(new URL("/auth/login", req.nextUrl))
    }

}

export const config = {
    matcher: ["/auth/login",
        "/auth/register",
        "/admin/:path*",
        "/participant/:path*",
        "/api/:path*"
    ]
}