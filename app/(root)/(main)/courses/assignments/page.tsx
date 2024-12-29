import AssignmentsTable from "../../../../../components/assignments/AssignmentsTable";
import { getUser } from "@/action/user.action";
import AssignmentActions from "@/components/assignments/AssignmentActions";
import { AssignmentStatus } from "@prisma/client";
import { getAssignmentsWithFilters } from "@/action/assignment.action";
import { getCoursesByUserId } from "@/action/course.action";

export default async function Assignments({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const user = await getUser();
	const params = await searchParams;
	const courseFilter = params?.course as string | undefined;
	const statusFilter = params?.status as AssignmentStatus | undefined;

	const assignments = await getAssignmentsWithFilters(
		user?.id as string,
		courseFilter,
		statusFilter,
	);
	const courses = await getCoursesByUserId(user?.id as string);

	return (
		<div className="">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-medium flex items-center gap-2">
					All Assignments
					{(courseFilter || statusFilter) && (
						<span className="text-muted text-lg font-normal">
							•{" "}
							{courseFilter
								? courses.find(c => c.id === courseFilter)?.name
								: statusFilter}
						</span>
					)}
				</h1>
				<AssignmentActions courses={courses} />
			</div>
			<AssignmentsTable initialAssignments={assignments} courses={courses} />
		</div>
	);
}
