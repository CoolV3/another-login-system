"use client"

import {register} from "@/app/actions/auth";
import {SubmitEventHandler, useState} from "react";




export default function SignupForm() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [nameError, setNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [generalError, setGeneralError] = useState("")

    const handleLogin: SubmitEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault()
        setNameError("")
        setEmailError("")
        setPasswordError("")
        setGeneralError("")

        if (!name) {
            setNameError("Please type in a name")
            return
        }
        if (!email) {
            setEmailError("Please type in a email")
            return
        }
        if (!password) {
            setPasswordError("Please type in a password")
            return
        }
        const formData = new FormData(event.currentTarget);
        const response = await register(formData)

        setGeneralError(response.message ?? "")
        if (!response.success) {
            setNameError(response.errors?.name?.at(0) ?? "")
            setEmailError(response.errors?.email?.at(0) ?? "")
            setPasswordError(response.errors?.password?.at(0) ?? "")
            return
        }

    };

    return(
        <div className="flex items-center justify-center h-screen">
            <div className="bg-gray-50 p-10 rounded-2xl">
                <h1 className="text-5xl text-center pb-10">Login</h1>
                <form className="flex flex-col gap-10" onSubmit={handleLogin}>
                    <div className="flex flex-col gap-5">
                        <div>
                            <p>Name</p>
                            <input name="name" onChange={(e) => setName(e.target.value)} className="p-3 border-2 rounded-2xl text-lg aria-invalid:border-red-500 " placeholder="Max Musterman" type="text" aria-invalid={!!nameError}/>
                            {nameError && (<p className="text-red-600 text-center">{nameError}</p>)}
                        </div>
                        <div>
                            <p>Email</p>
                            <input name="email" onChange={(e) => setEmail(e.target.value)} className="p-3 border-2 rounded-2xl text-lg aria-invalid:border-red-500 " placeholder="email@example.com" type="email" aria-invalid={!!emailError}/>
                            {emailError && (<p className="text-red-600 text-center">{emailError}</p>)}
                        </div>
                        <div>
                            <p>Password</p>
                            <input name="password" onChange={(e) => setPassword(e.target.value)} className="p-3 border-2 rounded-2xl text-lg aria-invalid:border-red-500" placeholder="････････" type="password" aria-invalid={!!passwordError}/>
                            {passwordError && (<p className="text-red-600 text-center">{passwordError}</p>)}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <button type={"submit"} className="bg-yellow-400 px-5 py-3 text-lg rounded-2xl cursor-pointer">Sign Up</button>
                        {generalError && (<p className="text-red-600 text-center">{generalError}</p>)}
                    </div>
                </form>
            </div>
        </div>
    )
}