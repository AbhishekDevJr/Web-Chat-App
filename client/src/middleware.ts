import { NextResponse } from "next/server";
import { authRoutes, protectedRoutes } from "./helpers/constants";

export default function middleware(req: any) {

    const verify = req.cookies.get('token');
    const url = req.url;
    const isProtectedRoute = protectedRoutes.some((item) => url.includes(item));
    const isPublicRoute = authRoutes.some((item) => url.includes(item));

    console.log('Client Middleware---------------------->', verify);

    if (!verify && isProtectedRoute) return NextResponse.redirect(`https://exclusivemessengerclient.vercel.app/`);

    if (verify && isPublicRoute) return NextResponse.redirect(`https://exclusivemessengerclient.vercel.app/userdashboard`);
}