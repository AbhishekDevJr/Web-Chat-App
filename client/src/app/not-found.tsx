import Link from "next/link";

export default function NotFount() {
    return (
        <div className=''>
            <h1>Page Not Found!</h1>
            <Link href='/'>Return Home</Link>
        </div>
    );
}