import { AssignmentType, GradingPolicy } from "@prisma/client";

export interface Course {
	name: string;
	type: "AP" | "IB" | "Honors" | "Regular";
}

export type ExtendedGradingPolicy = GradingPolicy & {
	assignmentTypes: AssignmentType[];
};

export type GradingPoliciesWithAGPId = {
	gradingPolicy: (GradingPolicy & {
		assignmentTypes: AssignmentType[];
	})[];
	agpId: string;
};

export interface CourseFilterDropdownProps {
	isOpen: boolean;
	onClose: () => void;
}
