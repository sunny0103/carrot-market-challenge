import getSession from "@/lib/session";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

const logOut = async () => {
  "use server";
  const session = await getSession();
  await session.destroy();
  redirect("/login");
};

export default function NavigationBar() {
  return (
    <div className="flex bg-neutral-800 border-b-2 border-neutral-700 h-[4vw] w-full items-center justify-between px-4">
      <span className="flex justify-center text-3xl">🐦</span>
      <div className="flex items-center gap-4">
        <Link
          href={"/"}
          className="font-semibold bg-transparent px-10 py-3 hover:bg-blue-500 hover:rounded-2xl transition-all ease-in-out"
        >
          Home
        </Link>
        <form action={logOut}>
          <button className="font-semibold bg-transparent px-10 py-3 hover:bg-blue-500 hover:rounded-2xl transition-all ease-in-out">
            Log out
          </button>
        </form>
      </div>
    </div>
  );
}
