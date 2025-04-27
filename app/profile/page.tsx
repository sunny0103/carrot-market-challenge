import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) {
      return user;
    }
  }
  notFound();
}
export default async function Profile() {
  const user = await getUser();
  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/");
  };
  return (
    <div className="flex min-h-screen mt-5">
      <h1 className="flex w-[92vw] justify-center text-4xl font-bold">
        welcome {user?.username} 😃
      </h1>
      <form action={logOut}>
        <button className="font-semibold bg-transparent border-2 border-transparent hover:border-white hover:rounded-2xl transition-all  ease-in-out p-3">
          Log out
        </button>
      </form>
    </div>
  );
}
