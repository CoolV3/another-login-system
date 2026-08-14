import Link from "next/link";


export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center bg-zinc-50 font-sans h-screen">
      <h1 className="text-5xl pb-10">Another Login System</h1>
      <div className="flex gap-5">
        <Link href="/login" className="bg-yellow-400 px-5 py-3 text-lg rounded-2xl cursor-pointer">Log In</Link>
        <Link href="/signup" className="bg-yellow-400 px-5 py-3 text-lg rounded-2xl cursor-pointer">Sign Up</Link>
        <Link href="/dashboard/settings" className="bg-yellow-400 px-5 py-3 text-lg rounded-2xl cursor-pointer">Account Settings</Link>
      </div>
    </div>
  );
}
