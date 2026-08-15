import Link from "next/link";


export default function Dashboard() {


    return (
        <div className="flex items-center justify-center">
            <h1 className="text-4xl text-center">Here you can code your application.</h1>
            <Link href="/dashboard/settings" className="bg-yellow-400 px-5 py-3 text-lg rounded-2xl cursor-pointer">Account Settings</Link>
        </div>
    )
}