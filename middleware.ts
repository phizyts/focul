import { NextResponse, type NextRequest } from "next/server";
import { getSessionWithCache, updateSessionCache } from "./lib/session-cache";

export const PRIVATE_ROUTES = ["/onboarding"];
export const AUTH_ROUTES = ["/auth/login", "/auth/signup"];

export default async function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;

	if (path === "/dashboard") {
		return NextResponse.redirect(new URL("/dashboard/overview", request.url));
	}

	if (
		PRIVATE_ROUTES.includes(path) ||
		path.startsWith("/dashboard/") ||
		AUTH_ROUTES.includes(path)
	) {
		const session = await getSessionWithCache(request);
		const isAuthenticated = !!session?.user;

		if (!isAuthenticated) {
			if (PRIVATE_ROUTES.includes(path) || path.startsWith("/dashboard/")) {
				return NextResponse.redirect(new URL("/auth/login", request.url));
			}

			if (AUTH_ROUTES.includes(path)) {
				return NextResponse.next();
			}
		}

		if (isAuthenticated) {
			const response = NextResponse.next();
			const currentCache = request.cookies.get("session_cache")?.value;
			updateSessionCache(response, session, currentCache);

			if (AUTH_ROUTES.includes(path)) {
				return NextResponse.redirect(
					new URL("/dashboard/overview", request.url),
				);
			}

			if (!session.user.onboarded && path !== "/onboarding") {
				return NextResponse.redirect(new URL("/onboarding", request.url));
			}
			if (session.user.onboarded && path === "/onboarding") {
				return NextResponse.redirect(
					new URL("/dashboard/overview", request.url),
				);
			}

			return response;
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|403|404|500).*)",
	],
};
