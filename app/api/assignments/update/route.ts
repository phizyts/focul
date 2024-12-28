import { updateGrade, updateStatus } from "@/action/assignment.action";
import { getUser } from "@/action/user.action";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const user = await getUser();
		if (!user) {
			return new Response("Unauthorized", { status: 401 });
		}

		const { assignmentId, status, grade } = await req.json();

		if (!assignmentId || !status) {
			return new Response("Missing required fields", { status: 400 });
		}

		await updateStatus(assignmentId, status);
		if (status === "Graded" && grade !== null) {
			await updateGrade(assignmentId, grade);
		}
		if (status === "Pending") {
			await updateGrade(assignmentId, -1);
		}
		return new Response("Assignment status updated successfully", {
			status: 200,
		});
	} catch (error) {
		console.error(error);
		return new Response("Internal Server Error", { status: 500 });
	}
}
