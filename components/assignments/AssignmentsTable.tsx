"use client";

import { useState } from "react";
import {
	Courses as Course,
	Assignments as Assignment,
	AssignmentStatus,
} from "@prisma/client";
import { formatDueDate } from "@/utils/formatDueDate";
import { formatGrade } from "@/utils/formatGrade";
import SecondaryButton from "@/components/ui/buttons/SecondaryButton";

export default function AssignmentsTable({
	initialAssignments,
	courses,
}: {
	initialAssignments: Assignment[];
	courses: Course[];
}) {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const totalPages = Math.ceil(initialAssignments.length / itemsPerPage);
	const currentAssignments = initialAssignments.slice(startIndex, endIndex);

	return (
		<div className="flex flex-col gap-4">
			<div className="border border-border rounded-[10px] w-full overflow-x-auto">
				<table className="w-full min-w-[650px]">
					<thead className="border-b border-border w-full">
						<tr className="text-left text-muted">
							<th className="py-2 pl-5 font-normal">
								<i className="ri-hashtag"></i> Name
							</th>
							<th className="py-2 font-normal">
								<i className="ri-menu-search-line"></i> Category
							</th>
							<th className="py-2 font-normal">
								<i className="ri-percent-line"></i> Grade
							</th>
							<th className="py-2 font-normal">
								<i className="ri-time-line"></i> Due Date
							</th>
							<th className="py-2 font-normal">
								<i className="ri-loader-line"></i> Status
							</th>
						</tr>
					</thead>
					<tbody>
						{currentAssignments.map((assignment, index) => (
							<tr
								key={assignment.id}
								className={`hover:bg-[#F5F5F5] cursor-pointer ${
									index < currentAssignments.length - 1
										? "border-b border-border"
										: ""
								}`}
								onClick={() => {
									window.location.href = `/courses/assignments/${assignment.id}`;
								}}
							>
								<td className="py-3 pl-5 truncate max-w-[130px]">
									{assignment.name}
								</td>
								<td className="py-3">
									{courses.find(c => c.id === assignment.courseId)?.name}
								</td>
								<td className="py-3">
									{`${formatGrade(assignment?.grade as number)}/${assignment.maxGrade}`}
								</td>
								<td className="py-3 flex gap-1 items-center">
									<i className="ri-calendar-schedule-fill"></i>
									{formatDueDate(assignment.dueDate)}
								</td>
								<td className="py-3">
									<span
										className={`px-3 py-1 rounded-full text-sm ${
											assignment.status === AssignmentStatus.Graded
												? "bg-green-100 text-green-800"
												: assignment.status === AssignmentStatus.Completed
													? "bg-blue-100 text-blue-800"
													: assignment.status === AssignmentStatus.Overdue
														? "bg-red-100 text-red-800"
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
			</div>

			{totalPages > 1 && (
				<div className="flex justify-end items-center gap-2">
					{currentPage > 1 && (
						<SecondaryButton
							text="Previous"
							onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
							disabled={currentPage === 1}
							extraClasses="!mt-0"
						/>
					)}

					{currentPage < totalPages && (
						<SecondaryButton
							text="Next"
							onClick={() =>
								setCurrentPage(prev => Math.min(prev + 1, totalPages))
							}
							disabled={currentPage === totalPages}
							extraClasses="!mt-0"
						/>
					)}
				</div>
			)}
		</div>
	);
}
