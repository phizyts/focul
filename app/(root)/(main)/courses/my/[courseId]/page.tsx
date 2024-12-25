import { getAssignments, getAssignmentTypes } from "@/action/assignment.action";
import { getCourse } from "@/action/course.action";
import InfoCard from "@/components/ui/cards/InfoCard";
import AssignmentsTable from "@/components/ui/tables/AssignmentsTable";
import { AssignmentType, Courses, User } from "@prisma/client";
import Link from "next/link";
import CourseDetailsActions from "@/components/ui/courses/CourseDetailsActions";
import {
	getCourseGrade,
	getOverdueAssignments,
	getPendingAssignments,
} from "@/utils/course.utils";
import { getUser } from "@/action/user.action";

export default async function CoursePage({
	params,
}: {
	params: Promise<{ courseId: string }>;
}) {
	const user = await getUser();
	const { courseId } = await params;
	const course = await getCourse(courseId);
	const assignments = await getAssignments(course as Courses);
	const assignmentTypes = await getAssignmentTypes(user as User);
	const assignmentsCount = assignments.length;

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
						value={`${getCourseGrade(course)}%`}
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
					<AssignmentsTable
						assignments={assignments}
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
