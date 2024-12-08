import { prisma } from "@/prisma";

export const getAssignmentCounts = async (course: any) => {
	const assignments = await prisma.assignments.findMany({
		where: {
			courseId: course.id,
		},
	});
	return assignments.length;
};
