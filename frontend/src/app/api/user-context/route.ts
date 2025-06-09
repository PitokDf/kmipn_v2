import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const userData = req.headers.get('x-user-data')

    if (!userData) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const user = JSON.parse(Buffer.from(userData, "base64").toString("utf-8"));
        return NextResponse.json({
            success: true,
            user: user
        })
    } catch (error) {
        console.error('Error parsing user data:', error)
        return NextResponse.json({ error: 'Invalid user data' }, { status: 400 })
    }
}