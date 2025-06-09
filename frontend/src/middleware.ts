import { jwtVerify } from "jose"
import { NextRequest, NextResponse } from "next/server";

const SECRET_KEY = process.env.JWT_SECRET || ""
const encoder = new TextEncoder()
const secret = encoder.encode(SECRET_KEY)

const allowedPathByRole: { [key: string]: string[] } = {
    "participant": [
        "/participant",
        "/participant/team",
        "/participant/complete-team",
        "/participant/proposal",
        "/participant/submission",
        "/api/user-context"
    ],
    "admin": [
        "/admin",
        "/admin/categories",
        "/admin/proposals",
        "/admin/submission",
        "/admin/assessments",
        "/admin/rounds",
        "/admin/reports/assessments",
        "/admin/reports/teams",
        "/admin/teams",
        "/admin/users",
        "/admin/timeline",
        "/api/user-context",
    ],
    "operator": [
        "/admin",
        "/admin/proposals",
        "/admin/submission",
        "/admin/assessments",
        "/admin/rounds",
        "/admin/reports/assessments",
        "/admin/reports/teams",
        "/admin/teams",
        "/api/user-context"
    ]
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get("accessToken")?.value

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

        // Selalu set header x-user-data untuk semua request yang sudah terverifikasi
        const requestHeaders = new Headers(req.headers)
        requestHeaders.set('x-user-data', Buffer.from(JSON.stringify(payload)).toString("base64"))

        const roleUser: any = payload.role;
        const teamDataCompleate = payload.teamDataCompleate;

        // Redirect logic untuk authenticated users
        if (roleUser === "admin" || roleUser === "operator") {
            if (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register")) {
                return NextResponse.redirect(new URL("/admin", req.nextUrl))
            }
        } else if (roleUser === "participant") {
            if (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register")) {
                return NextResponse.redirect(new URL("/participant", req.nextUrl))
            }
        }

        // Team completion check untuk participant
        if (roleUser === "participant" && !teamDataCompleate) {
            if (pathname.startsWith("/participant/complete-team")) {
                return NextResponse.next({ request: { headers: requestHeaders } });
            }
            return NextResponse.redirect(new URL(`/participant/complete-team`, req.nextUrl))
        } else {
            if (pathname.startsWith("/participant/complete-team")) {
                return NextResponse.redirect(new URL(`/participant`, req.nextUrl))
            }
        }

        // Role-based access control
        const allowedPath = allowedPathByRole[roleUser] || [];
        if (!allowedPath.includes(pathname)) {
            return NextResponse.rewrite(new URL("/401", req.nextUrl))
        }

        // Selalu return dengan headers yang sudah di-set
        return NextResponse.next({ request: { headers: requestHeaders } })

    } catch (err) {
        console.error('Token tidak valid:', err)
        if (pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register")) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/auth/login", req.nextUrl))
    }
}

export const config = {
    matcher: [
        "/auth/login",
        "/auth/register",
        "/admin/:path*",
        "/participant/:path*",
        "/api/:path*"
    ]
}