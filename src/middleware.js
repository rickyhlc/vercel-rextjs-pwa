import { NextResponse } from "next/server";
import { auth } from "./auth/authConfig";

export default async function middleware(request) {
    const session = await auth();

    const { pathname, origin } = request.nextUrl;

    console.log("middleware runs for ", request.url, pathname, origin, new URL("/signIn", request.url));

    if (session?.user?.email) {
        if (process.env.VALID_EMAILS.split(",").includes(session.user.email)) {
            return NextResponse.next();
        }
    }
    return NextResponse.redirect(new URL(`${origin}/signIn`, request.url)); 
}

export const config = {
    matcher: ["/home"],
}