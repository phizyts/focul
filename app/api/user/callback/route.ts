import { getUser } from "@/action/user.action";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const user = await getUser();
	if (!user) {
		return NextResponse.json({ error: "User not found" }, { status: 401 });
	}
	await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/fetchaccounts`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			cookie: request.headers.get("cookie") ?? "",
		},
	});
	return NextResponse.redirect(new URL("/dashboard", request.url));
}
