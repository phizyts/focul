import { getLinkedAccounts, getUser } from "@/action/user.action";
import { prisma } from "@/prisma";
import { linkedAccounts } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const user = await getUser();
		if (!user) {
			return NextResponse.json({ accounts: [] }, { status: 401 });
		}

		const accounts = await getLinkedAccounts();
		const linkedAccounts = accounts
			.filter(
				(account: any) =>
					account === "google" || account === "github" || account === "discord",
			)
			.map(
				(account: string) => account.charAt(0).toUpperCase() + account.slice(1),
			);

		await prisma.user.update({
			where: { id: user.id },
			data: {
				linkedAccounts: {
					set: linkedAccounts as linkedAccounts[],
				},
			},
		});

		return NextResponse.json(
			{ message: "Accounts fetched successfully" },
			{ status: 200 },
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
