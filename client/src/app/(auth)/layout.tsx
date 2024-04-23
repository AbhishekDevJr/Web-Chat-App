import HeaderComp from "@/components/Header";

export default function AuthLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <div>
            <HeaderComp />
            {children}
        </div>
    );
}