import {getCurrentUser} from "@/lib/auth";
import {prisma} from "@/lib/prisma";

export type SessionState = {
    success?: boolean
    message?: string
    errors?: string
    sessions?: []
}

export default async function getSessions() {

    const user = await getCurrentUser()

    if (!user) {
        return {success: false, error: "Please log in first"}
    }

    const userSessions = await prisma.session.findMany({
        where: {
            userId: user.id
        },
        select: {
            expiresAt: true,
            userAgent: true,
            createdAt: true,
            id: true
        }
    })

    return {
        success: true,
        message: "Successfully fetched all Sessions",
        sessions: userSessions
    }

}