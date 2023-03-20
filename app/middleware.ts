import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyUser } from "../utils/auth";

export default async function middleware(req: NextRequest) {
  const cookies = req.cookies.getAll();
  let idToken = "";
  cookies.forEach((cookie) => {
    if (cookie.name.includes("idToken")) idToken = cookie.value;
  });

  if (idToken.length == 0) {
    req.nextUrl.pathname = "/login";
    return NextResponse.redirect(req.nextUrl);
  }

  const ifLoggedIn = await verifyUser(idToken);
  if (ifLoggedIn.succcess === true) {
    return NextResponse.next();
  }

  req.nextUrl.pathname = "/login";
  return NextResponse.redirect(req.nextUrl);
}

export const config = {
  matcher: "/protected/:path*",
};
