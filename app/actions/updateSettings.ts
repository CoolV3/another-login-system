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
        newPassword?: string[]
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

const passwordUpdateSchema = z.object({
    oldPassword: z.string(),
    newPassword: z
        .string()
        .min(8, "Your new password must contain at least 8 characters")
        .regex(/[a-z]/, "Your new password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Your new password must contain at least one uppercase letter")
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

export async function updatePassword(FormData: FormData): Promise<UpdateState> {
    const validation = await passwordUpdateSchema.safeParseAsync({oldPassword: FormData.get("oldPassword"), newPassword : FormData.get("newPassword")})

    if (!validation.success) {
        const errors = z.flattenError(validation.error).fieldErrors
        return {
            success: false,
            message: "Please correct the fields",
            errors: {
                password: errors.oldPassword,
                newPassword: errors.newPassword
            }
        }
    }

    const { oldPassword, newPassword } = validation.data

    const user = await getCurrentUser()

    if (!user) {return ({success: false, message: "Please log in first"})}
    const email = user.email

    const userOldPasswordHash = await prisma.user.findUnique({
        where: {
            email,
        },
        select: {
            hashedPassword: true
        }
    })

    if (userOldPasswordHash == null) {
        return ({success: false, message: "Please log in first"})
    }

    const verify = await argon2.verify(userOldPasswordHash.hashedPassword, oldPassword)

    if (!verify) {
        return {
            success: false,
            message: "Your old password is wrong",
            errors: { password: ["Wrong password"]}
        }
    }
    const newHashedPassword = await argon2.hash(newPassword, {type: argon2id})

    try {
        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                hashedPassword: newHashedPassword
            }
        })
    } catch(e) {
        return {
            success: false,
            message: "Error while updating your Account",
        }
    }

    return {
        success: true,
        message: "Successfully updated your Account."
    }

}

