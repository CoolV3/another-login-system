"use client"

import Link from "next/link";
import {logout} from "@/app/actions/auth";
import {usePathname} from "next/navigation";

export default function SideNavBar() {

    const pathname = usePathname();

    const logoutFunction = async () => {
        await logout()
    }
    const navItems = [
        {
            name: "General",
            link: "/dashboard/settings/general"
        },
        {
            name: "Sessions",
            link: "/dashboard/settings/sessions"
        },
        {
            name: "Password",
            link: "/dashboard/settings/password"
        },
    ]
    return (
        <div className="bg-gray-50 lg:w-80 w-60 h-screen p-2 flex flex-col justify-between">
            <div>
                <h1 className="text-3xl font-bold border-b-2 pb-5">Another Login System</h1>
                <div className="flex flex-col">
                    {navItems.map((item, index) => {
                        const currentLink = pathname == item.link
                        return (
                            <Link href={item.link} key={index} className={`cursor-pointer text-lg transition-colors px-5 py-3 ${currentLink ? "bg-gray-200 hover:bg-gray-300" : "bg-gray-100 hover:bg-gray-200"}`}>{item.name}</Link>
                        )

                    })}
                </div>
            </div>
            <div>
                <button onClick={() => logoutFunction()} className="px-5 py-3 bg-gray-200 rounded-2xl text-red-400 cursor-pointer">Log out</button>
            </div>
        </div>
    )
}