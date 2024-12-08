"use client";

import { Assignments, Courses } from "@prisma/client";
import Image from "next/image";
import "remixicon/fonts/remixicon.css";

interface CourseCardProps {
	courses: (Courses & { assignments: Assignments[] })[];
}

export default function CourseCard({ courses }: CourseCardProps) {
	const getAssignmentCount = (
		course: Courses & { assignments: Assignments[] },
	) => {
		return course.assignments?.length || 0;
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl4:grid-cols-4 gap-6">
			{courses.map((course: Courses & { assignments: Assignments[] }) => (
				<div
					key={course.id}
					className="group overflow-hidden border border-[#3B4245] rounded-lg p-6 flex flex-col gap-4 relative cursor-pointer"
				>
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-3 text-muted group-hover:text-white transition-all duration-200">
							<i className="ri-graduation-cap-fill text-xl"></i>
							<h2 className="text-xl">{course.name}</h2>
						</div>
						<button className="rounded-full text-muted hover:text-white">
							<i className="ri-more-2-fill"></i>
						</button>
					</div>
					<div className="text-4xl font-medium">
						{course.grade ? `${course.grade}%` : "N/A"}
					</div>
					<div className="text-muted">
						{getAssignmentCount(course)} Assignments
					</div>
					<Image
						src="/coursebgghat.svg"
						alt="course background"
						width={200}
						height={200}
						priority
						className="absolute top-0 -right-2 xl3:right-0 pointer-events-none select-none group-hover:brightness-200 group-hover:saturate-200 transition-all duration-200"
					/>
				</div>
			))}
		</div>
	);
}
