"use client"

import {ReactNode} from "react";
import SideNavBar from "@/components/sidenavbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {

    return (
        <div className="flex min-h-screen">
            <SideNavBar />
            <div className="flex-1 p-8">
                {children}
            </div>
        </div>
    );
}