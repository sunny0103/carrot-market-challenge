import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

interface Routes {
    [key:string]:boolean;
}
const publicOnlyUrl:Routes ={
    "/":true,
    "/login":true,
    "/create-account":true
}
export async function middleware(request:NextRequest) {
    const session = await getSession();
    const exist = publicOnlyUrl[request.nextUrl.pathname];
    if(!session.id){
        if(!exist){
            return NextResponse.redirect(new URL("/", request.url));
        }
    }else{
        if(exist){
            return NextResponse.redirect(new URL("/product", request.url));
        }
    }
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};