import { NextResponse, type NextRequest } from "next/server";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "./routes";

async function getSession(request: NextRequest) {
	try {
		const req = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/get-session`,
			{
				headers: {
					cookie: request.headers.get("cookie") ?? "",
				},
			},
		);

		if (!req.ok) return null;
		return req.json();
	} catch (error) {
		console.error("Session fetch error:", error);
		return null;
	}
}

async function updateUserLocation(request: NextRequest) {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/fetchlocation`,
			{
				method: "POST",
				headers: {
					cookie: request.headers.get("cookie") ?? "",
				},
				signal: AbortSignal.timeout(5000),
			},
		);
		return response.ok;
	} catch (error) {
		console.error("Location update error:", error);
		return false;
	}
}

export default async function middleware(request: NextRequest) {
	const currentPath = request.nextUrl.pathname;
	const isProtectedRoute = PROTECTED_ROUTES.some(route =>
		currentPath.startsWith(route),
	);
	const isAuthRoute = AUTH_ROUTES.includes(currentPath);

	if (isProtectedRoute || isAuthRoute) {
		const session = await getSession(request);

		if (session) {
			if (!session.user.onboarded && currentPath !== "/onboarding") {
				return NextResponse.redirect(new URL("/onboarding", request.url));
			}

			if (session.user.onboarded && currentPath === "/onboarding") {
				return NextResponse.redirect(new URL("/dashboard", request.url));
			}

			if (AUTH_ROUTES.includes(currentPath)) {
				return NextResponse.redirect(new URL("/dashboard", request.url));
			}

			if (session.user.location === "Location Not Set") {
				await updateUserLocation(request);
			}
		} else {
			if (!isAuthRoute) {
				return NextResponse.redirect(new URL("/auth/login", request.url));
			}
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|403|404|500|images).*)",
	],
};
