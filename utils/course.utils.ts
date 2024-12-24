import { Assignments, Courses } from "@prisma/client";

export const getAssignmentCount = (
	course: Courses & { assignments: Assignments[] },
) => {
	return course.assignments?.length || 0;
};

export const getCourseGrade = (
	course: (Courses & { assignments?: Assignments[] }) | null,
) => {
	if (!course || course.grade === -1) {
		return "--";
	}
	return course.grade;
};
