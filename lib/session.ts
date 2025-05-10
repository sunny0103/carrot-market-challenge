import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
    id?: number;
}

const sessionOptions = {
    cookieName: "delicious-cookie",
    password: process.env.COOKIE_PASSWORD!,
    secure: process.env.NODE_ENV === "production",
};

export default async function getSession() {
    return getIronSession<SessionContent>(await cookies(), sessionOptions);
}