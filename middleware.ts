import { NextResponse, type NextRequest } from "next/server";

export const PRIVATE_ROUTES = [
	"/dashboard",
	"/dashboard/overview",
	"/onboarding",
];
export const AUTH_ROUTES = ["/auth/login", "/auth/signup"];

export default async function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;

	if (path === "/dashboard") {
		return NextResponse.redirect(new URL("/dashboard/overview", request.url));
	}

	if (PRIVATE_ROUTES.includes(path) || AUTH_ROUTES.includes(path)) {
		const req = await fetch(
			`${process.env.BETTER_AUTH_URL}/api/auth/get-session`,
			{
				headers: {
					cookie: request.headers.get("cookie") ?? "",
				},
			},
		);

		const session = await req.json();

		if (session?.user) {
			if (!session.user.onboarded && path !== "/onboarding") {
				return NextResponse.redirect(new URL("/onboarding", request.url));
			}
			if (session.user.onboarded && path === "/onboarding") {
				return NextResponse.redirect(
					new URL("/dashboard/overview", request.url),
				);
			}
			if (AUTH_ROUTES.includes(path)) {
				return NextResponse.redirect(
					new URL("/dashboard/overview", request.url),
				);
			}
		} else {
			if (PRIVATE_ROUTES.includes(path)) {
				return NextResponse.redirect(new URL("/auth/login", request.url));
			}
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|403|404|500).*)",
	],
};
