"use server"

import {getCurrentUser} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
import {revalidatePath} from "next/cache";

export default async function deleteSession(sessionId: number) {
    const user = await getCurrentUser()

    if (!user) {
        throw new Error("Please log in first");
    }
    const deletedSessions = await prisma.session.deleteMany({
        where: {
            id: sessionId,
            userId: user.id
        }
    })

    if (deletedSessions.count == 0) {
        throw new Error("Session not found");
    }

    revalidatePath("/dashboard/settings/sessions")

}