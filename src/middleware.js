import { NextResponse } from "next/server";
import { auth } from "@/lib/authConfig";

export default async function middleware(request) {
    const session = await auth();

    const { pathname } = request.nextUrl;

    console.log("middleware runs for ", pathname);
    
    // for testing use
    // return NextResponse.next();

    if (session?.user?.email) {
        if (process.env.LIMITED_ACCESS === "false" || process.env.VALID_EMAILS.split(",").includes(session.user.email)) {
            return NextResponse.next();
        }
    }

    console.log("middleware redirects to signIn");
    return NextResponse.redirect(new URL("/signIn", request.url)); 
}

// define paths that require authentication
export const config = {
    matcher: ["/", "/home", "/bank", "/api/bank/:path*"],
}