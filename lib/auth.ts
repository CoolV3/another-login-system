"use server"

import {cookies} from "next/headers";
import {createHash} from "node:crypto";
import {prisma} from "@/lib/prisma";

export async function getCurrentUser() {

    const cookie = await cookies()
    const token = cookie.get("sessionToken")?.value

    if (!token) {
        return null
    }

    const tokenHash = createHash("sha256").update(token).digest("hex")
    const session = await prisma.session.findUnique({
        where: {token: tokenHash},
        select: {
            expiresAt: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    })

    if (!session) {
        return null
    }

    if (session.expiresAt <= new Date()) {
        await prisma.session.delete({
            where: {token: tokenHash}
        })
        return null
    }

    return session.user
}