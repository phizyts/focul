"use client";
import { formatDueDate } from "@/utils/formatDueDate";
import { Assignments } from "@prisma/client";

const AssignmentsTable = ({ assignments }: { assignments: Assignments[] }) => {
	return (
		<table className="w-full min-w-[650px]">
			<thead className="border-t border-border w-full">
				<tr className="text-left text-muted">
					<th className="py-2 pl-5 font-normal">Name</th>
					<th className="py-2 font-normal">Category</th>
					<th className="py-2 font-normal">Grade</th>
					<th className="py-2 font-normal">Due Date</th>
					<th className="py-2 font-normal">Status</th>
				</tr>
			</thead>
			<tbody>
				{assignments.map(assignment => (
					<tr
						className="hover:bg-[#F5F5F5] cursor-pointer"
						key={assignment.id}
						onClick={() => {
							window.location.href = `/assignments/${assignment.id}`;
						}}
					>
						<td className="py-3 pl-5 truncate max-w-[130px]">
							{assignment.name}
						</td>
						<td className="py-3">{assignment.type}</td>
						<td className="py-3">
							{assignment.status === "Pending"
								? `--/${assignment.maxGrade}`
								: `assignment.grade/${assignment.maxGrade}`}
						</td>
						<td className="py-3 flex gap-1 items-center">
							<i className="ri-calendar-schedule-fill"></i>
							{formatDueDate(assignment.dueDate)}
						</td>
						<td className="py-3">
							<span
								className={`px-3 py-1 rounded-full text-sm ${
									assignment.status !== "Pending"
										? "bg-green-100 text-green-800"
										: "bg-yellow-100 text-yellow-800"
								}`}
							>
								{assignment.status}
							</span>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};
export default AssignmentsTable;
