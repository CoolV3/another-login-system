import Settings from "@/components/settings";
import {redirect} from "next/navigation";


export default function SettingsPage() {

    redirect("/dashboard/settings/general");

}