import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

// Cache responses for 1 hour to avoid rate limits
const CACHE_DURATION = 3600000; // 1 hour in milliseconds
const cache = new Map();

export async function POST(request: NextRequest) {
	try {
		const req = await fetch(
			`${process.env.BETTER_AUTH_URL}/api/auth/get-session`,
			{
				headers: {
					cookie: request.headers.get("cookie") ?? "",
				},
			},
		);

		const session = await req.json();
		if (!session?.user?.id) {
			console.error("Auth failed:", { session });
			return NextResponse.json({ error: "User not found" }, { status: 401 });
		}

		const cachedLocation = cache.get(session.user.id);
		if (
			cachedLocation &&
			Date.now() - cachedLocation.timestamp < CACHE_DURATION
		) {
			return NextResponse.json({
				message: "Location retrieved from cache",
				location: cachedLocation.location,
			});
		}

		const ipResponse = await fetch("https://api.ipify.org?format=json");
		if (!ipResponse.ok) {
			console.error("IP fetch failed:", {
				status: ipResponse.status,
				statusText: ipResponse.statusText,
			});
			return NextResponse.json(
				{ error: "Failed to fetch IP address" },
				{ status: 500 },
			);
		}

		const { ip } = await ipResponse.json();

		const locationResponse = await fetch(`http://ip-api.com/json/${ip}`);
		if (!locationResponse.ok) {
			console.error("Location API failed:", {
				status: locationResponse.status,
				statusText: locationResponse.statusText,
			});
			return NextResponse.json(
				{ error: "Failed to fetch location data" },
				{ status: 500 },
			);
		}

		const data = await locationResponse.json();
		if (!data.city || !data.country) {
			console.error("Location API returned incomplete data:", data);
		}

		const location =
			data.city && data.country
				? `${data.city}, ${data.country}`
				: "Location Not Set";

		try {
			await prisma.user.update({
				where: { id: session.user.id },
				data: { location },
			});

			cache.set(session.user.id, {
				location,
				timestamp: Date.now(),
			});

			return NextResponse.json({
				message: "Location updated successfully",
				location,
			});
		} catch (dbError) {
			console.error("Database update failed:", dbError);
			return NextResponse.json(
				{ error: "Failed to save location to database" },
				{ status: 500 },
			);
		}
	} catch (error) {
		console.error("Error updating location:", error);
		return NextResponse.json(
			{ error: "Failed to update location" },
			{ status: 500 },
		);
	}
}
