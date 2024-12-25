import { CourseType, User } from "@prisma/client";
import { prisma } from "@/prisma";

export async function createCourse(
	name: string,
	type: CourseType,
	userId: string,
) {
	await prisma.courses.create({
		data: {
			name,
			type,
			userId: userId,
		},
	});
	return;
}

export const getAllCourses = async (user: User, type?: string | null) => {
	try {
		const courses = await prisma.courses.findMany({
			where: {
				userId: user.id,
				...(type && { type: type as CourseType }),
			},
			include: {
				assignments: true,
			},
			orderBy: {
				createdAt: "desc",
			},
		});
		return courses;
	} catch (error) {
		console.error("Error fetching courses:", error);
		return [];
	}
};

export async function getCourse(courseId: string) {
	return await prisma.courses.findUnique({
		where: {
			id: courseId,
		},
	});
}

export async function updateCourse(
	name: string,
	type: CourseType,
	courseId: string,
) {
	await prisma.courses.update({
		where: {
			id: courseId,
		},
		data: {
			name,
			type,
		},
	});
	return;
}

export async function deleteCourse(courseId: string) {
	await prisma.courses.delete({
		where: {
			id: courseId,
		},
	});
	return;
}
