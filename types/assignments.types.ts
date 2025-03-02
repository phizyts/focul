import { Assignments, AssignmentType } from "@prisma/client";

export type AssignmentWithType = Assignments & {
	assignmentType: AssignmentType;
};
