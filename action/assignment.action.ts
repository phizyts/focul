import { prisma } from "@/prisma";
import { Courses } from "@prisma/client";

export const getAssignments = async (course: Courses) => {
	try {
		const assignments = await prisma.assignments.findMany({
			where: {
				courseId: course.id,
			},
			orderBy: {
				createdAt: "desc",
			},
		});
		return assignments;
	} catch (error) {
		console.error("Error fetching assignments:", error);
		return [];
	}
};
