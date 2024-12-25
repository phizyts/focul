import { Assignments, Courses } from "@prisma/client";

export const getAssignmentCount = (
	course: Courses & { assignments: Assignments[] },
) => {
	return course.assignments?.length || 0;
};

export const getPendingAssignments = (assignments: any) => {
	const pendingAssignments = assignments.filter((assignment: any) => {
		return assignment.status === "Pending";
	});
	return pendingAssignments.length;
};
export const getOverdueAssignments = (assignments: any) => {
	const overdueAssignments = assignments.filter((assignment: any) => {
		return assignment.status === "Overdue";
	});
	return overdueAssignments.length;
};

export const getCourseGrade = (
	course: (Courses & { assignments?: Assignments[] }) | null,
) => {
	if (!course || course.grade === -1) {
		return "--";
	}
	return course.grade;
};
