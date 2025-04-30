import { NextResponse } from "next/server";
import { auth } from "./auth/authConfig";

export default async function middleware(request) {
    const session = await auth();

    const { pathname } = request.nextUrl;

    console.log("middleware runs for ", pathname);

    if (session) {
        if (process.env.VALID_EMAILS.split(",").includes(session.user.email)) {
            return NextResponse.next();
        }
    }
    return NextResponse.redirect(new URL("/signIn", request.url)); 
}

export const config = {
    matcher: ["/"],
}