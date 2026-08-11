"use client"


import {SubmitEventHandler, useState} from "react";
import {updatePassword} from "@/app/actions/updateSettings";

export default function PasswordSettingsForm() {
    const [oldPassword, setOldPassword] = useState("")
    const [oldPasswordError, setOldPasswordError] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [retypeNewPassword, setRetypeNewPassword] = useState("")
    const [retypeNewPasswordError, setRetypeNewPasswordError] = useState("")
    const [newPasswordError, setNewPasswordError] = useState("")
    const [generalError, setGeneralError] = useState("")


    const handleUpdate: SubmitEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault();
        setOldPasswordError("")
        setNewPasswordError("")
        setRetypeNewPasswordError("")
        setGeneralError("")

        if (!oldPassword) {
            setOldPasswordError("Please type in your old Password")
            return
        }
        if (!newPassword) {
            setNewPasswordError("Please type in your new password")
            return
        }
        if (!retypeNewPassword) {
            setRetypeNewPasswordError("Please retype in your new password again")
            return
        }
        if (newPassword != retypeNewPassword) {
            setRetypeNewPasswordError("New passwords do not match")
            return
        }

        const formData = new FormData(event.currentTarget);

        const response = await updatePassword(formData)

        setGeneralError(response.message ?? "")

        if (!response.success) {
            setOldPasswordError(response.errors?.password?.at(0) ?? "")
            setNewPasswordError(response.errors?.newPassword?.at(0) ?? "")
            return
        }
        
    };

    return (
        <div className="flex flex-col">
            <h1 className="text-center text-4xl pb-10">Password Settings</h1>
            <form onSubmit={handleUpdate}>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                        <p>Old Password</p>
                        <input placeholder="････････" type="password"  value={oldPassword} name="oldPassword" onChange={(e) => setOldPassword(e.target.value)} className="p-3 border-2 rounded-2xl text-lg aria-invalid:border-red-500 " aria-invalid={!!oldPasswordError}/>
                        {oldPasswordError && (<p className="text-red-600 text-center">{oldPasswordError}</p>)}

                    </div>
                    <div className="flex flex-col gap-2">
                        <p>New Password</p>
                        <input placeholder="････････" type="password"  value={newPassword} name="newPassword" onChange={(e) => setNewPassword(e.target.value)} className="p-3 border-2 rounded-2xl text-lg aria-invalid:border-red-500 " aria-invalid={!!newPasswordError}/>
                        {newPasswordError && (<p className="text-red-600 text-center">{newPasswordError}</p>)}
                    </div>
                    <div className="flex flex-col gap-2">
                        <p>Retype New Password</p>
                        <input placeholder="････････" type="password"  value={retypeNewPassword} name="retypeNewPassword" onChange={(e) => setRetypeNewPassword(e.target.value)} className="p-3 border-2 rounded-2xl text-lg aria-invalid:border-red-500 " aria-invalid={!!retypeNewPasswordError}/>
                        {retypeNewPasswordError && (<p className="text-red-600 text-center">{retypeNewPasswordError}</p>)}
                    </div>
                    <button type={"submit"} className="bg-yellow-400 px-5 py-3 text-lg rounded-2xl cursor-pointer aria-disabled:grayscale-100 aria-disabled:cursor-not-allowed" aria-disabled={oldPassword == "" || newPassword == "" || retypeNewPassword == ""}>Update</button>
                    {generalError && (<p className="text-red-600 text-center">{generalError}</p>)}
                </div>
            </form>
        </div>
    )
}