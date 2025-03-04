import { getCourse } from "@/action/course.action";
import InfoCard from "@/components/ui/cards/InfoCard";
import { Assignments, AssignmentType, Courses, User } from "@prisma/client";
import Link from "next/link";
import CourseDetailsActions from "@/components/courses/details/CourseDetailsActions";
import {
	getOverdueAssignments,
	getPendingAssignments,
} from "@/utils/course.utils";
import { formatGrade } from "@/utils/formatGrade";
import {
	getAssignmentsWithFilters,
	getAssignmentTypes,
} from "@/action/assignment.action";
import AssignmentDetailsTable from "@/components/assignments/details/AssignmentDetailsTable";
import NotFoundComponent from "@/components/NotFoundComponent";

type AssignmentWithType = Assignments & {
	assignmentType: AssignmentType;
};

export default async function CoursePage({
	params,
}: {
	params: Promise<{ courseId: string }>;
}) {
	const { courseId } = await params;
	const { data: course } = await getCourse(courseId);
	if (!course) return <NotFoundComponent />;
	const { data: assignments } = await getAssignmentsWithFilters(courseId);
	const { data: assignmentTypes } = await getAssignmentTypes();
	const assignmentsCount = assignments && assignments.length;

	const assignmentsWithTypes = assignments?.map(assignment => {
		const assignmentType = assignmentTypes?.find(
			type => type.id === assignment.assignmentTypeId,
		);
		return {
			...assignment,
			assignmentType,
		} as AssignmentWithType;
	});

	return (
		<>
			<div className="w-full">
				<div className="flex justify-between items-center mb-4">
					<div className="flex items-center gap-2">
						<Link href="/courses/my">
							<i className="ri-arrow-go-back-line text-2xl text-primary cursor-pointer"></i>
						</Link>
						<h1 className="text-2xl font-medium text-primary">
							{course?.name}
						</h1>
					</div>
					<CourseDetailsActions course={course as Courses} />
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl2:grid-cols-4 gap-6">
					<InfoCard
						title="Grade Average"
						value={`${formatGrade(course?.grade as Number)}%`}
						icon="ri-bar-chart-fill"
					/>
					<InfoCard
						title="Assignments"
						value={`${assignmentsCount}`}
						icon="ri-bar-chart-fill"
					/>
					<InfoCard
						title="Pending"
						value={`${getPendingAssignments(assignments)}`}
						icon="ri-bar-chart-fill"
					/>
					<InfoCard
						title="Overdue"
						value={`${getOverdueAssignments(assignments)}`}
						icon="ri-bar-chart-fill"
					/>
				</div>
				<div className="grid xl2:grid-cols-5 xl3:grid-cols-3 gap-6">
					<AssignmentDetailsTable
						assignments={assignmentsWithTypes as AssignmentWithType[]}
						assignmentTypes={assignmentTypes as AssignmentType[]}
						courseId={courseId}
					/>
					<div className="border border-border rounded-[10px] xl2:mt-6 w-full xl2:col-span-2 xl3:col-span-1">
						<div className="flex items-center mb-4 gap-2 px-5 pt-5">
							<i className="ri-book-open-fill text-muted"></i>
							<h2 className="text-muted">Notes</h2>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
