import { NextResponse, type NextRequest } from "next/server";

export const PRIVATE_ROUTES = ["/onboarding"];
export const AUTH_ROUTES = ["/auth/login", "/auth/signup"];

async function getSession(request: NextRequest) {
	const req = await fetch(
		`${process.env.BETTER_AUTH_URL}/api/auth/get-session`,
		{
			headers: {
				cookie: request.headers.get("cookie") ?? "",
			},
		},
	);

	if (!req.ok) return null;
	return req.json();
}

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
		const session = await getSession(request);
		const isAuthenticated = !!session?.user;

		if (!isAuthenticated) {
			if (PRIVATE_ROUTES.includes(path) || path.startsWith("/dashboard/")) {
				return NextResponse.redirect(new URL("/auth/login", request.url));
			}

			if (AUTH_ROUTES.includes(path)) {
				return NextResponse.next();
			}
		}

		if (isAuthenticated && session) {
			const response = NextResponse.next();

			if (session.user.location === "Location Not Set") {
				const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
				const host = request.headers.get('host') || 'localhost:3000';
				await fetch(`${protocol}://${host}/api/user/fetchlocation`, {
					method: "POST",
					headers: {
						cookie: request.headers.get("cookie") ?? "",
					},
				});
			}

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
