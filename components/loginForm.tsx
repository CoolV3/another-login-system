



export default function LoginForm() {



    return(
        <div className="flex items-center justify-center h-screen">
            <div className="bg-gray-50 p-10 rounded-2xl">
                <h1 className="text-5xl text-center pb-10">Login</h1>
                <form className="flex flex-col gap-10">
                    <div>
                        <div>
                            <p>Email</p>
                            <input className="p-3 border-2 rounded-2xl text-lg" placeholder="email@example.com" type="email"/>
                        </div>
                        <div>
                            <p>Password</p>
                            <input className="p-3 border-2 rounded-2xl text-lg " placeholder="･････････" type="password"/>
                        </div>
                    </div>
                    <button className="bg-yellow-400 px-5 py-3 text-lg rounded-2xl">Log In</button>
                </form>
            </div>
        </div>
    )
}