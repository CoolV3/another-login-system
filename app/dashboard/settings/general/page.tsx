
import {getCurrentUser} from "@/lib/auth";
import GeneralSettingsForm from "@/components/settings/generalform";


export default async function SettingsGeneralPage() {
    const user = await getCurrentUser()

    return (
        <div className="flex flex-col">
            <GeneralSettingsForm name={user?.name ?? ""} email={user?.email ?? ""}/>
        </div>
    )
}