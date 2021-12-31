import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    const token = await getToken({req, secret: process.env.JWT_SECRET});

    // mengambil pathname dari request url dari browser
    const { pathname } = req.nextUrl;
    // jika sudah ada token dan pathname bukan /login
    if (pathname.includes('/api/auth') || token) {
        // cek jika masuk ke halaman login
        if (pathname.includes('/login') && token) { 
            return NextResponse.redirect('/');
        }
        return NextResponse.next();
    }
    // jika belum login, redirect ke halaman login
    if(!token && !pathname.includes('/login')) {
        return NextResponse.redirect('/login');
    }
}
