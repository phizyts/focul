import { getUser } from "@/action/user.action";
import { prisma } from "@/prisma";
import { AssignmentType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const user = await getUser();
	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	try {
		const { isCustom, assignmentTypes, policyId } = await req.json();

		const currentPolicy = await prisma.gradingPolicy.findUnique({
			where: { id: policyId },
			include: { assignmentTypes: true },
		});

		if (!currentPolicy) {
			return NextResponse.json({ error: "Policy not found" }, { status: 404 });
		}

		if (user.agpId !== policyId) {
			const userCourses = await prisma.courses.findMany({
				where: { userId: user.id },
				select: { id: true },
			});

			if (userCourses.length > 0) {
				await prisma.assignments.deleteMany({
					where: {
						courseId: {
							in: userCourses.map(course => course.id),
						},
					},
				});
			}

			await prisma.user.update({
				where: { id: user.id },
				data: { agpId: policyId },
			});
		}

		if (isCustom) {
			const currentTypeIds = currentPolicy.assignmentTypes.map(type => type.id);
			const keptTypeIds = (assignmentTypes as AssignmentType[])
				.filter(type => !type.id.includes("new-"))
				.map(type => type.id);

			const typesToDelete = currentTypeIds.filter(
				id => !keptTypeIds.includes(id),
			);

			if (typesToDelete.length > 0) {
				await prisma.assignmentType.deleteMany({
					where: {
						id: { in: typesToDelete },
					},
				});
			}

			for (const type of assignmentTypes as AssignmentType[]) {
				if (type.id.includes("new-")) {
					await prisma.assignmentType.create({
						data: {
							name: type.name,
							weight: type.weight,
							gradingPolicyId: policyId,
						},
					});
				} else {
					await prisma.assignmentType.update({
						where: { id: type.id },
						data: {
							name: type.name,
							weight: type.weight,
						},
					});
				}
			}
		}

		return NextResponse.json({ message: "Policy updated successfully" });
	} catch (error) {
		console.error("Error updating grading policy:", error);
		return NextResponse.json(
			{ error: "Failed to update grading policy" },
			{ status: 500 },
		);
	}
}
