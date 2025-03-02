import { initializeGradingPolicy } from "@/action/policy.action";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const { success, message } = await initializeGradingPolicy();
	if (success) {
		return NextResponse.json({ message }, { status: 200 });
	} else {
		return NextResponse.json({ error: message }, { status: 400 });
	}
}
