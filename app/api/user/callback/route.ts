import { fetchAndUpdateLinkedAccounts, getUser } from "@/action/user.action";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const { data: user } = await getUser();
	const callback = request.nextUrl.searchParams.get("callback");
	if (!user) {
		return NextResponse.json({ error: "User not found" }, { status: 401 });
	}
	if (callback) {
		await fetchAndUpdateLinkedAccounts();
	}
	return NextResponse.redirect(new URL("/dashboard", request.url));
}
