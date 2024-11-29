import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

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
			return NextResponse.json({ error: "User not found" }, { status: 401 });
		}

		const response = await fetch("https://ipapi.co/json/");
		if (!response.ok) {
			return NextResponse.json(
				{ error: "Failed to fetch location data" },
				{ status: 500 },
			);
		}

		const data = await response.json();
		const location =
			data.city && data.country_name
				? `${data.city}, ${data.country_name}`
				: "Location Not Set";

		await prisma.user.update({
			where: { id: session.user.id },
			data: { location },
		});

		return NextResponse.json({
			message: "Location updated successfully",
			location,
		});
	} catch (error) {
		console.error("Error updating location:", error);
		return NextResponse.json(
			{ error: "Failed to update location" },
			{ status: 500 },
		);
	}
}
