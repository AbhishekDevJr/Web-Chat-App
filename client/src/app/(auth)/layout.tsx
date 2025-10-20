'use client';
import HeaderComp from "@/components/Header";
import { Spin } from "antd";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";

export default function AuthLayout({
    children
}: {
    children: React.ReactNode
}) {
    const router = useRouter();
    const [isAuthChecked, setIsAuthchecked] = useState(false);

    useLayoutEffect(() => {
        const token = localStorage.getItem('auth_token');

        if(token){
            router.push('/userdashboard');
            return;
        }

        setIsAuthchecked(true);
    }, []);

    if (!isAuthChecked) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spin size="large" tip="Checking authentication..." />
            </div>
        );
    }

    return (
        <div>
            <HeaderComp />
            {children}
        </div>
    );
}