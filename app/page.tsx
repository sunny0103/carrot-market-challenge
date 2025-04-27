import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="flex justify-between items-center gap-10 p-3 mt-5">
        <span className="border-2 p-3 rounded-full text-xs font-bold italic">
          MW
        </span>
        <h1 className="text-6xl font-extrabold">PROJECT SITE</h1>
        <div className="flex gap-4 *:font-semibold *:p-3">
          <div className="bg-transparent border-2 border-transparent hover:border-white hover:rounded-2xl transition-all  ease-in-out">
            <Link href={"/login"}>Log In</Link>
          </div>
          <div className="bg-transparent border-2 border-transparent hover:border-white hover:rounded-2xl transition-all  ease-in-out">
            <Link href={"/create-account"}>Sign Up</Link>
          </div>
        </div>
      </div>
      <div className="w-[90vw] h-[63vh] relative p-4 border-2 rounded-2xl mt-[12vh] ml-[5vw]">
        <div className="relative w-full h-full">
          <Image
            src={"/home_img.jpg"}
            alt=""
            fill
            className="object-cover opacity-75"
            priority
          />
          <span className="absolute bottom-3 right-3 font-semibold italic">
            Project website using Next JS
          </span>
        </div>
      </div>
    </div>
  );
}
