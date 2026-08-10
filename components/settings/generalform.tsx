"use client"


import {getCurrentUser} from "@/lib/auth";
import {useState} from "react";

export default function GeneralSettingsForm({name, email} : {name?: string, email?: string}) {
    const [updatedName, setUpdatedName] = useState(name)
    const [nameError, setNameError] = useState("")
    const [updatedEmail, setUpdatedEmail] = useState(email)
    const [emailError, setEmailError] = useState("")


    const updateName = async ()=> {
        if (!updatedName) {
            return
        }
    }

    const updateEmail = async ()=> {
        if (!updatedName) {
            return
        }
    }

    return (
        <div className="flex flex-col">
            <h1 className="text-center text-4xl pb-10">General Settings</h1>
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                    <p>Update Name</p>
                    <input value={updatedName} name="name" onChange={(e) => setUpdatedName(e.target.value)} className="p-3 border-2 rounded-2xl text-lg aria-invalid:border-red-500 " placeholder={name} type="name" aria-invalid={!!nameError}/>
                    {nameError && (<p className="text-red-600 text-center">{nameError}</p>)}
                    <button onClick={() => updateName()} type={"submit"} className="bg-yellow-400 px-5 py-3 text-lg rounded-2xl cursor-pointer aria-disabled:grayscale-100 aria-disabled:cursor-not-allowed" aria-disabled={name == updatedName}>Update</button>
                </div>
                <div className="flex flex-col gap-2">
                    <p>Update Email</p>
                    <input value={updatedEmail} name="name" onChange={(e) => setUpdatedEmail(e.target.value)} className="p-3 border-2 rounded-2xl text-lg aria-invalid:border-red-500 " placeholder={name} type="name" aria-invalid={!!nameError}/>
                    {emailError && (<p className="text-red-600 text-center">{emailError}</p>)}
                    <button  onClick={() => updateEmail()} type={"submit"} className="bg-yellow-400 px-5 py-3 text-lg rounded-2xl cursor-pointer aria-disabled:grayscale-100 aria-disabled:cursor-not-allowed" aria-disabled={email == updatedEmail}>Update</button>
                </div>
            </div>
        </div>
    )
}