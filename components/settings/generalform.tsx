"use client"


import {SubmitEventHandler, useState} from "react";
import {updateNameEmail} from "@/app/actions/updateSettings";

export default function GeneralSettingsForm({name, email} : {name?: string, email?: string}) {
    const [updatedName, setUpdatedName] = useState(name)
    const [nameError, setNameError] = useState("")
    const [updatedEmail, setUpdatedEmail] = useState(email)
    const [emailError, setEmailError] = useState("")
    const [generalError, setGeneralError] = useState("")


    const handleUpdate: SubmitEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        setEmailError("")
        setNameError("")
        setGeneralError("")

        if (!email) {
            setEmailError("Please type in a email")
            return
        }
        if (!name) {
            setNameError("Please type in a password")
            return
        }

        const formData = new FormData(event.currentTarget);

        const response = await updateNameEmail(formData)

        setGeneralError(response.message ?? "")

        if (!response.success) {
            setEmailError(response.errors?.email?.at(0) ?? "")
            setNameError(response.errors?.name?.at(0) ?? "")
            return
        }
        
    };

    return (
        <div className="flex flex-col">
            <h1 className="text-center text-4xl pb-10">General Settings</h1>
            <form onSubmit={handleUpdate}>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                        <p>Update Name</p>
                        <input value={updatedName} name="name" onChange={(e) => setUpdatedName(e.target.value)} className="p-3 border-2 rounded-2xl text-lg aria-invalid:border-red-500 " placeholder={name} type="name" aria-invalid={!!nameError}/>
                        {nameError && (<p className="text-red-600 text-center">{nameError}</p>)}

                    </div>
                    <div className="flex flex-col gap-2">
                        <p>Update Email</p>
                        <input value={updatedEmail} name="email" onChange={(e) => setUpdatedEmail(e.target.value)} className="p-3 border-2 rounded-2xl text-lg aria-invalid:border-red-500 " placeholder={name} type="name" aria-invalid={!!nameError}/>
                        {emailError && (<p className="text-red-600 text-center">{emailError}</p>)}
                    </div>
                    <button type={"submit"} className="bg-yellow-400 px-5 py-3 text-lg rounded-2xl cursor-pointer aria-disabled:grayscale-100 aria-disabled:cursor-not-allowed" aria-disabled={name == updatedName && email == updatedEmail}>Update</button>
                </div>
            </form>
        </div>
    )
}