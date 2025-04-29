import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

interface Routes {
    [key:string]:boolean;
}
const publicOnlyUrl:Routes ={
    "/login":true,
    "/create-account":true
}

export async function middleware(request:NextRequest) {
    const session = await getSession();
    const isPublicUrl = publicOnlyUrl[request.nextUrl.pathname];
    
    if(!session.id){
        if(!isPublicUrl){
            return NextResponse.redirect(new URL("/login", request.url));
        }
    } else {
        // 로그인한 경우
        // 로그인 페이지나 회원가입 페이지에 접근하려고 하면 홈으로 리다이렉트
        if(isPublicUrl){
            return NextResponse.redirect(new URL("/", request.url));
        }
    }
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};