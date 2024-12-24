"use client";
import { courseTypes } from "@/constants/constants";
import { Courses } from "@prisma/client";

interface Course {
	name: string;
	type: "AP" | "IB" | "Honors" | "Regular";
}

export const EditCourse = ({
	courseName,
	setCourseName,
	courseType,
	setCourseType,
}: {
	course: Courses;
	courseName: string;
	setCourseName: (name: string) => void;
	courseType: Course["type"];
	setCourseType: (type: Course["type"]) => void;
}) => {
	return (
		<form className="flex flex-col gap-4">
			<div className="flex flex-col gap-2">
				<label className="text-primary">Course Name</label>
				<input
					type="text"
					value={courseName}
					onChange={e => setCourseName(e.target.value)}
					className="w-full text-sm px-4 h-[35px] border border-border rounded-lg text-primary placeholder-muted"
					placeholder="Enter course name"
					required
				/>
			</div>

			<div className="flex flex-col gap-2">
				<label className="text-primary">Course Type</label>
				<select
					value={courseType}
					onChange={e => setCourseType(e.target.value as Course["type"])}
					className="w-full text-sm px-4 h-[35px] rounded-lg border border-border duration-200 cursor-pointer"
					style={{
						backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
						backgroundRepeat: "no-repeat",
						backgroundPosition: "right 12px center",
						paddingRight: "40px",
						WebkitAppearance: "none",
						MozAppearance: "none",
					}}
					required
				>
					{courseTypes.map(type => (
						<option
							key={type.value}
							value={type.value}
							className="bg-background text-primary"
						>
							{type.display}
						</option>
					))}
				</select>
			</div>
		</form>
	);
};
