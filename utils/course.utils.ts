import { Assignments, Courses, AssignmentType } from "@prisma/client";

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

export const calculateCourseAverage = (
	assignments: (Assignments & { assignmentType: AssignmentType })[],
) => {
	if (!assignments || assignments.length === 0) return -1;

	const assignmentsByType = assignments.reduce(
		(acc, assignment) => {
			if (assignment.grade === null || assignment.grade === undefined)
				return acc;

			const typeId = assignment.assignmentType.id;
			if (!acc[typeId]) {
				acc[typeId] = {
					weight: assignment.assignmentType.weight,
					totalPoints: 0,
					totalPossiblePoints: 0,
					name: assignment.assignmentType.name,
				};
			}
			acc[typeId].totalPoints += assignment.grade;
			acc[typeId].totalPossiblePoints += assignment.maxGrade;
			return acc;
		},
		{} as Record<
			string,
			{
				weight: number;
				totalPoints: number;
				totalPossiblePoints: number;
				name: string;
			}
		>,
	);

	let finalGrade = 0;
	let totalWeight = 0;

	for (const typeData of Object.values(assignmentsByType)) {
		if (typeData.totalPossiblePoints > 0) {
			totalWeight += typeData.weight;
		}
	}

	if (totalWeight === 0) return -1;

	for (const typeData of Object.values(assignmentsByType)) {
		if (typeData.totalPossiblePoints > 0) {
			const typePercentage =
				(typeData.totalPoints / typeData.totalPossiblePoints) * 100;
			finalGrade += typePercentage * (typeData.weight / totalWeight);
		}
	}

	return finalGrade;
};
