"use client"

import {useState} from "react";


export default function SettingsGeneralPage() {
    const [updatedName, setUpdatedName] = useState("")
    const [nameError, setNameError] = useState("")

    const updateName = async ()=> {
        if (!updatedName) {
            return
        }
    }

    return (
        <div className="flex flex-col">
            <h1 className="text-center text-4xl pb-10">General Settings</h1>
            <div className="flex flex-col gap-2">
                <p>Name</p>
                <input name="Name" onChange={(e) => setUpdatedName(e.target.value)} className="p-3 border-2 rounded-2xl text-lg aria-invalid:border-red-500 " placeholder="Max Mustermann" type="name" aria-invalid={!!nameError}/>
                {nameError && (<p className="text-red-600 text-center">{nameError}</p>)}
                <button type={"submit"} className="bg-yellow-400 px-5 py-3 text-lg rounded-2xl cursor-pointer">Update</button>
            </div>
        </div>
    )
}