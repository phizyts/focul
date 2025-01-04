import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/action/user.action";
import { prisma } from "@/prisma";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
	const { newPassword } = await req.json();
	try {
		const user = await getUser();
		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 401 });
		}
		if (user.passwordSet) {
			return NextResponse.json(
				{ error: "Password already set" },
				{ status: 400 },
			);
		}

		await auth.api.setPassword({
			headers: await headers(),
			body: { newPassword },
		});

		await prisma.user.update({
			where: { id: user.id },
			data: {
				passwordSet: true,
			},
		});

		return NextResponse.json({ message: "Password set successfully" });
	} catch (error) {
		console.error("Error setting password:", error);
		return NextResponse.json(
			{ error: "Failed to set password" },
			{ status: 400 },
		);
	}
}
