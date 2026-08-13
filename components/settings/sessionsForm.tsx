import getSessions from "@/app/actions/getSessions";
import deleteSession from "@/app/actions/deleteSession";

const dateFormatter = new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
});

export default async function SessionsForm() {

    const sessions = await getSessions()
    const userSessions = sessions.sessions

    if (!userSessions) {
        return
    }

    const delteSession = () => {

    }

    return (
        <div className="flex flex-col">
            <h1 className="text-4xl text-center">Sessions</h1>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full table-fixed">
                        <colgroup>
                            <col className="w-[18%]"/>
                            <col className="w-[18%]"/>
                            <col className="w-[46%]"/>
                            <col className="w-[18%]"/>
                        </colgroup>
                        <thead className="bg-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Created At</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Expires At</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">User Agent</th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {userSessions.map((session, index) => {
                                const deleteSessionWithId = deleteSession.bind(null, session.id)

                                return (
                                    <tr key={index} className="transition-colors hover:bg-gray-50">
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">{dateFormatter.format(session.createdAt)}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">{dateFormatter.format(session.expiresAt)}</td>
                                        <td className="px-6 py-4"><p className="truncate text-sm text-gray-700" title={session.userAgent ?? "No User Agent captured"}>{session.userAgent ?? "No User Agent captured"}</p></td>
                                        <td>
                                            <form onSubmit={deleteSessionWithId}>
                                                <button type="submit" className="px-5 py-3 bg-gray-200 rounded-2xl text-red-400 cursor-pointer">Delete Session</button>
                                            </form>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}