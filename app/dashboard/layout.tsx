import {ReactNode} from "react";
import {redirect} from "next/navigation";
import {getCurrentUser} from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const user = await getCurrentUser()
    if (!user) {
        redirect("/login")
    }

    return (
        <div className="min-h-screen">
            {children}
        </div>
);
}