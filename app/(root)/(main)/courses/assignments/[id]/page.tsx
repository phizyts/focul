import { getAssignment, getAssignmentTypes } from "@/action/assignment.action";
import AssignmentDetailsAction from "@/components/assignments/details/AssignmentDetailsAction";
import NotFoundComponent from "@/components/NotFoundComponent";
import ContentCard from "@/components/ui/cards/ContentCard";
import InfoCard from "@/components/ui/cards/InfoCard";
import { formatDueDate } from "@/utils/formatDueDate";
import { formatGrade } from "@/utils/formatGrade";
import { AssignmentType, Prisma, User } from "@prisma/client";
import Link from "next/link";

export default async function AssignmentDetailsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const { data: assignment } = await getAssignment(id);
	if (!assignment) return <NotFoundComponent />;
	const assignmentType = assignment?.assignmentType;
	const { data: assignmentTypes } = await getAssignmentTypes();
	return (
		<div className="w-full">
			<div className="flex justify-between items-center mb-4">
				<div className="flex items-center gap-2">
					<Link href={`/courses/my/${assignment?.courseId}`}>
						<i className="ri-arrow-go-back-line text-2xl text-primary cursor-pointer"></i>
					</Link>
					<h1 className="text-2xl font-medium text-primary">
						{assignment?.name}
					</h1>
				</div>
				<AssignmentDetailsAction
					assignment={
						assignment as Prisma.AssignmentsGetPayload<{
							include: { assignmentType: true };
						}>
					}
					assignmentTypes={assignmentTypes as AssignmentType[]}
				/>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl2:grid-cols-4 gap-6 mb-6">
				<InfoCard
					title="Grade"
					value={`${formatGrade(assignment?.grade as Number)}/${assignment?.maxGrade}`}
					icon="ri-bar-chart-fill"
				/>
				<InfoCard
					title="Due Date"
					value={`${formatDueDate(assignment?.dueDate as Date)}`}
					icon="ri-bar-chart-fill"
				/>
				<InfoCard
					title="Type"
					value={`${assignmentType?.name}`}
					icon="ri-bar-chart-fill"
				/>
				<InfoCard
					title="Status"
					value={`${assignment?.status}`}
					icon="ri-bar-chart-fill"
				/>
			</div>
			<ContentCard
				title="Assignment Description"
				content={
					assignment?.description
						? (assignment.description as string)
						: "This assignment has no description."
				}
			/>
		</div>
	);
}
