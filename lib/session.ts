import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
    id?: number;
}

const sessionOptions = {
    cookieName: "delicious-cookie",
    password: process.env.COOKIE_PASSWORD || 
        (() => {
            throw new Error("COOKIE_PASSWORD environment variable is not set");
        })(),
    secure: process.env.NODE_ENV === "production",
};

export default async function getSession() {
    if (!process.env.COOKIE_PASSWORD) {
        throw new Error(
            "Please provide COOKIE_PASSWORD environment variable. " +
            "It should be at least 32 characters long."
        );
    }
    
    return getIronSession<SessionContent>(await cookies(), sessionOptions);
}