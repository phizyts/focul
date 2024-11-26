import { CourseType } from "@prisma/client";
import { getUser } from "./user.action";
import { prisma } from "@/prisma";

export async function createCourse(name: string, type: CourseType) {
	await prisma.courses.create({
		data: {
			name,
			type,
			userId: (await getUser())?.id as string,
		},
	});
	return;
}
