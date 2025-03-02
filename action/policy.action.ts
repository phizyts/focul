"use server";

import { prisma } from "@/prisma";
import { getAllGradingPolicy, getUser } from "./user.action";
import { AssignmentType } from "@prisma/client";

export const initializeGradingPolicy = async () => {
	const { data: user } = await getUser();
	if (!user) return { success: false, message: "Unauthorized" };
	try {
		if (user.agpId !== null)
			return {
				success: false,
				message: "Grading policies already initialized",
			};

		const { data: gradingPolicies } = await getAllGradingPolicy(true);

		if (
			!gradingPolicies?.gradingPolicy.length ||
			gradingPolicies.agpId === null
		) {
			const [hstatGradingPolicy, customGradingPolicy] = await Promise.all([
				await prisma.gradingPolicy.create({
					data: {
						userId: user.id,
						name: "HSTAT",
						scale: {
							A: { max: 100, min: 90 },
							B: { max: 89, min: 80 },
							C: { max: 79, min: 70 },
							D: { max: 69, min: 60 },
							F: { max: 59, min: 0 },
						},
					},
				}),
				await prisma.gradingPolicy.create({
					data: {
						userId: user.id,
						name: "Custom",
						scale: {
							A: { max: 100, min: 90 },
							B: { max: 89, min: 80 },
							C: { max: 79, min: 70 },
							D: { max: 69, min: 60 },
							F: { max: 59, min: 0 },
						},
					},
				}),
			]);
			await prisma.assignmentType.createMany({
				data: [
					{
						name: "Homework",
						gradingPolicyId: hstatGradingPolicy.id,
						weight: 20,
					},
					{
						name: "Classwork",
						gradingPolicyId: hstatGradingPolicy.id,
						weight: 30,
					},
					{
						name: "Summative Assessment",
						gradingPolicyId: hstatGradingPolicy.id,
						weight: 50,
					},
				],
			});
			await prisma.user.update({
				where: { id: user.id },
				data: {
					agpId: customGradingPolicy.id,
				},
			});
			return {
				success: true,
				message: "Grading policy initialized successfully",
			};
		}
		return {
			success: false,
			message: "Grading policies already initialized",
		};
	} catch (error) {
		console.error("Error initializing grading policy:", error);
		return { success: false, message: "Error initializing grading policy" };
	}
};

export const updateGradingPolicy = async (
	isCustom: boolean,
	assignmentTypes: AssignmentType[],
	policyId: string,
) => {
	const { data: user } = await getUser();
	if (!user) return { success: false, message: "Unauthorized" };
	if (typeof isCustom === "undefined" || !assignmentTypes || !policyId)
		return { success: false, message: "Missing required fields" };
	try {
		const currentPolicy = await prisma.gradingPolicy.findUnique({
			where: { id: policyId },
			include: { assignmentTypes: true },
		});

		if (!currentPolicy) return { success: false, message: "Policy not found" };

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
				await prisma.courses.updateMany({
					where: {
						userId: user.id,
					},
					data: {
						grade: null,
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

		return {
			success: true,
			message: "Grading policy updated successfully",
		};
	} catch (error) {
		console.error("Error updating grading policy:", error);
		return { success: false, message: "Error updating grading policy" };
	}
};
