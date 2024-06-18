import { NextResponse } from "next/server";
import { authRoutes, protectedRoutes } from "./helpers/constants";

export default function middleware(req: any) {

    const verify = req.cookies.get('token');
    const url = req.url;
    const isProtectedRoute = protectedRoutes.some((item) => url.includes(item));
    const isPublicRoute = authRoutes.some((item) => url.includes(item));

    console.log('Req URL-------------->', req?.url);

    if (!verify && isProtectedRoute) return NextResponse.redirect('http://localhost:3000');

    if (verify && isPublicRoute) return NextResponse.redirect('http://localhost:3000/userdashboard');
}