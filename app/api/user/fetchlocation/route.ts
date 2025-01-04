import { getUser } from "@/action/user.action";
import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const user = await getUser();
		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 401 });
		}

		const ipResponse = await fetch("https://api.ipify.org?format=json");
		if (!ipResponse.ok) {
			return NextResponse.json(
				{ error: "Failed to fetch IP address" },
				{ status: 500 },
			);
		}

		const { ip } = await ipResponse.json();

		const locationResponse = await fetch(`http://ip-api.com/json/${ip}`);
		if (!locationResponse.ok) {
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
				where: { id: user.id },
				data: { location },
			});

			return NextResponse.json({
				message: "Location updated successfully",
				location,
			});
		} catch (dbError) {
			return NextResponse.json(
				{ error: "Failed to save location to database" },
				{ status: 500 },
			);
		}
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to update location" },
			{ status: 500 },
		);
	}
}
