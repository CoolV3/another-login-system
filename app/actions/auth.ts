"use server";
import argon2, {argon2id} from "argon2"
import {z} from "zod"
import {prisma} from "@/lib/prisma";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import { createHash, randomBytes} from "node:crypto";

const sessionDuration = 1000 * 60 * 60 * 24 * 7;

export type AuthState = {
    success?: boolean
    message?: string
    errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
    }
}

const registerSchema = z.object({
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

    password: z
        .string()
        .min(8, "Your password must contain at least 8 characters")
        .regex(/[a-z]/, "Your password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Your password must contain at least one uppercase letter")
})

const loginSchema = z.object({
    email: z
        .email("Please enter a valid Email Adress")
        .trim()
        .toLowerCase(),

    password: z.string()
})

async function createNewSession(userId: number) {
    const token = randomBytes(32).toString("hex")
    const tokenHash = createHash("sha256").update(token).digest("hex")
    const expiresAt = new Date(Date.now() + sessionDuration)

    await prisma.session.create({
        data: {
            token: tokenHash,
            userId,
            expiresAt
        }
    })

    const cookie = await cookies()
    cookie.set("sessionToken", token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        expires: expiresAt
    })
}

export async function register(formData: FormData): Promise<AuthState> {
    const validation = await registerSchema.safeParseAsync({name: formData.get("name"), email: formData.get("email"), password: formData.get("password")})

    if (!validation.success) {
        const errors = z.flattenError(validation.error).fieldErrors
        return {
            success: false,
            message: "Please correct the fields",
            errors: {
                name: errors.name,
                email: errors.email,
                password:errors.password
            }
        }
    }

    const { name, email, password} = validation.data

    const checkUser = await prisma.user.findUnique({
        where: {
            email
        },
        select: {
            id: true
        }
    })

    if (checkUser) {
        return {
            success: false,
            message: "An account with that email already exists",
            errors: { email: ["An account with that email already exists"]}
        }
    }

    const hashedPassword = await argon2.hash(password,{type: argon2id})

    try {
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                hashedPassword
            },
            select: {
                id: true
            }
        })
        await createNewSession(newUser.id)

    } catch(e) {
        return {
            success: false,
            message: "Error while creating an account",
        }
    }
    redirect("/dashboard")
}

export async function login(formData: FormData): Promise<AuthState> {
    const validation = await loginSchema.safeParseAsync({email: formData.get("email"), password: formData.get("password")})
    if (!validation.success) {
        const errors = z.flattenError(validation.error).fieldErrors

        return {
            success: false,
            message: "",
            errors: {
                email: errors.email,
                password: errors.password
            }
        }
    }
    const {email, password} = validation.data

    const user = await prisma.user.findUnique({
        where: {email},
        select: {
            id: true,
            hashedPassword: true
        }
    })
    if (!user) {return {success: false, message: "Invalid email address or password"}}

    const isPasswordValid = await argon2.verify(user.hashedPassword, password)

    if (!isPasswordValid) {return {success: false, message: "Invalid email address or password"}}

    await createNewSession(user.id)

    redirect("/dashboard")
}

export async function logout(): Promise<void> {
    const cookie = await cookies()
    const token = cookie.get("session")?.value
    if (token) {
        const tokenHash = createHash("sha256").update(token).digest("hex")
        await prisma.session.deleteMany({
            where: {
                token: tokenHash
            }
        })
    }
    cookie.delete("session")
    redirect("login")
}



