import { NextRequest, NextResponse } from "next/server";

interface CachedSession {
	user: any;
	expires: string;
}

export async function getSessionWithCache(
	request: NextRequest,
): Promise<CachedSession | null> {
	const sessionCache = request.cookies.get("session_cache");
	let session: CachedSession | null = null;

	if (sessionCache) {
		try {
			const cachedSession = JSON.parse(sessionCache.value);
			if (
				cachedSession.expires &&
				new Date(cachedSession.expires) > new Date()
			) {
				session = cachedSession;
			}
		} catch {}
	}

	if (!session) {
		const req = await fetch(
			`${process.env.BETTER_AUTH_URL}/api/auth/get-session`,
			{
				headers: {
					cookie: request.headers.get("cookie") ?? "",
				},
			},
		);

		session = await req.json();
	}

	return session;
}

export function updateSessionCache(
	response: NextResponse,
	session: CachedSession,
	currentCache: string | undefined,
): void {
	if (!currentCache) {
		const expires = new Date(Date.now() + 5 * 60 * 1000);
		session.expires = expires.toISOString();
		response.cookies.set("session_cache", JSON.stringify(session), {
			expires,
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
		});
	}
}
