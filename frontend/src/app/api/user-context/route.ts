import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {

    const userData = req.headers.get('x-user-data')

    if (!userData) {
        return NextResponse.json({}, { status: 401 })
    }

    const user = JSON.parse(Buffer.from(userData!, "base64").toString("utf-8"));
    return NextResponse.json(user)
}
