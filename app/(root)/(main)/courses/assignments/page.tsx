import AssignmentsTable from "../../../../../components/assignments/AssignmentsTable";
import AssignmentActions from "@/components/assignments/AssignmentActions";
import type { Assignments, AssignmentStatus, Courses } from "@prisma/client";
import { getAssignmentsWithFilters } from "@/action/assignment.action";
import { getAllCourses } from "@/action/course.action";

export default async function Assignments({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const params = await searchParams;
	const courseFilter = params?.course as string | undefined;
	const statusFilter = params?.status as AssignmentStatus | undefined;

	const { data: assignmentsData } = await getAssignmentsWithFilters(
		courseFilter,
		statusFilter,
	);
	const { data: courses } = await getAllCourses();

	return (
		<div className="">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-medium flex items-center gap-2">
					All Assignments
					{(courseFilter || statusFilter) && (
						<span className="text-muted text-lg font-normal">
							•{" "}
							{courseFilter && courses
								? courses.find(c => c.id === courseFilter)?.name
								: statusFilter}
						</span>
					)}
				</h1>
				<AssignmentActions courses={courses as Courses[]} />
			</div>
			<AssignmentsTable
				initialAssignments={assignmentsData as Assignments[]}
				courses={courses as Courses[]}
			/>
		</div>
	);
}
