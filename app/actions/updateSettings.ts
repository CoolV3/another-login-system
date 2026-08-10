"use server";
import argon2, {argon2id} from "argon2"
import {z} from "zod"
import {prisma} from "@/lib/prisma";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import { createHash, randomBytes} from "node:crypto";
import {getCurrentUser} from "@/lib/auth";
import {revalidatePath} from "next/cache";

const sessionDuration = 1000 * 60 * 60 * 24 * 7;

export type UpdateState = {
    success?: boolean
    message?: string
    errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
    }
}

const updateScheme = z.object({
    name: z
        .string()
        .trim()
        .min(4, "Your name is too short. Please use at least 4 characters")
        .max(50, "Your Name is too long."),

    email: z
        .email()
        .trim()
        .toLowerCase()
        .min(4, "Your email is too short. Please use At least 4 characters.")
        .max(100, "Your email is too long. You may not use more than 100 characters"),
})


export async function updateNameEmail(FormData: FormData): Promise<UpdateState> {
    const validation = await updateScheme.safeParseAsync({name: FormData.get("name"), email : FormData.get("email")})

    if (!validation.success) {
        const errors = z.flattenError(validation.error).fieldErrors
        return {
            success: false,
            message: "Please correct the fields",
            errors: {
                name: errors.name,
                email: errors.email
            }
        }
    }

    const { name, email } = validation.data
    const user = await getCurrentUser()
    if (!user) {return ({success: false, message: "Please log in first"})}

    const EmailAlreadyUsed = await prisma.user.findUnique({
        where: {
            email,
            NOT: {
                id: user.id
            }
        },
        select: {
            id: true
        }
    })

    if (EmailAlreadyUsed) {
        return {
            success: false,
            message: "An account with that email already exists",
            errors: { email: ["An account with that email already exists"]}
        }
    }

    try {
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                name: name,
                email: email
            }
        })
    } catch(e) {
        return {
            success: false,
            message: "Error while updating your Account",
        }
    }

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/settings/general")

    return {
        success: true,
        message: "Successfully updated your Account."
    }

}

