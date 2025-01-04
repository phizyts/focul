"use client";

import { Assignments, Courses } from "@prisma/client";
import "remixicon/fonts/remixicon.css";
import { getAssignmentCount } from "@/utils/course.utils";
import { formatGrade } from "@/utils/formatGrade";

interface CourseCardProps {
	courses: (Courses & { assignments: Assignments[] })[];
}

export default function CourseCard({ courses }: CourseCardProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl2:grid-cols-4 gap-6">
			{courses.map((course: Courses & { assignments: Assignments[] }) => (
				<a
					href={`/courses/my/${course.id}`}
					key={course.id}
					className="overflow-hidden border border-border rounded-lg p-5 flex flex-col gap-3 relative cursor-pointer duration-200 hover:bg-[#f5f5f5]"
				>
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-2 text-muted transition-all duration-200">
							<i className="ri-graduation-cap-fill text-xl"></i>
							<h2 className="">{course.name}</h2>
						</div>
						<button className="rounded-full text-muted hover:text-primary">
							<i className="ri-more-2-fill"></i>
						</button>
					</div>
					<div className="text-4xl font-medium">{`${formatGrade(course.grade as Number)}%`}</div>
					<div className="flex justify-between items-center">
						<div className="text-muted text-sm">
							{getAssignmentCount(course)} Assignments
						</div>
						<div className="text-muted text-sm">{course.type}</div>
					</div>
				</a>
			))}
		</div>
	);
}
