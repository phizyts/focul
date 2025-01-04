import {
	initializeGradingPolicy,
	getAllGradingPolicy,
} from "@/action/user.action";
import { getUser } from "@/action/user.action";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const user = await getUser();

	if (!user) {
		return NextResponse.json({ error: "User not found" }, { status: 401 });
	}

	if (user.agpId !== null) {
		return NextResponse.json(
			{ message: "Grading policies already initialized" },
			{ status: 200 },
		);
	}

	const gradingPolicies = await getAllGradingPolicy(user.id, true);

	if (
		!gradingPolicies?.gradingPolicy.length ||
		gradingPolicies.agpId === null
	) {
		await initializeGradingPolicy(user.id);
	}
	return NextResponse.json(
		{ message: "Grading policies initialized" },
		{ status: 200 },
	);
}
