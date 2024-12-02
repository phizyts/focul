import { Modal } from "../Modal";
import { useState } from "react";
import { CourseType } from "@prisma/client";
import { courseTypes } from "@/constants/constants";

interface Course {
	name: string;
	type: "AP" | "IB" | "Honors" | "Regular";
}

interface CourseModalProps {
	isOpen: boolean;
	onClose: () => void;
	course?: Course;
	onSubmit: (course: Course | null) => void;
}

const CourseModal: React.FC<CourseModalProps> = ({
	isOpen,
	onClose,
	course,
	onSubmit,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [courseName, setCourseName] = useState(course?.name || "");
	const [courseType, setCourseType] = useState(course?.type || "");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			if (!courseName || !courseType) return;

			onSubmit({
				name: courseName,
				type: courseType as CourseType,
			});
			setCourseName("");
			setCourseType("");
			onClose();
		} catch (error) {
			console.error("Error handling course:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = () => {
		onSubmit(null);
		setCourseName("");
		setCourseType("");
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => {
				setCourseName(course?.name || "");
				setCourseType(course?.type || "");
				onClose();
			}}
			title={course ? "Edit Course" : "Add Course"}
		>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<label className="text-sm font-medium text-gray-300">
						Course Name
					</label>
					<input
						type="text"
						value={courseName}
						onChange={e => setCourseName(e.target.value)}
						className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-[#1A1D1E] text-white placeholder-gray-500"
						placeholder="Enter course name"
						required
					/>
				</div>

				<div className="flex flex-col gap-2">
					<label className="text-sm font-medium text-gray-300">
						Course Type
					</label>
					<select
						value={courseType}
						onChange={e => setCourseType(e.target.value as Course["type"])}
						className="w-full bg-[#1A1D1E] text-white py-2 px-4 h-[44px] rounded-lg border border-border hover:bg-[#2A2F30] duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer appearance-none"
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
						<option value="" disabled className="bg-[#1A1D1E] text-gray-400">
							Select a type
						</option>
						{courseTypes.map(type => (
							<option
								key={type.value}
								value={type.value}
								className="bg-[#1A1D1E] text-white hover:bg-[#2A2F30]"
							>
								{type.display}
							</option>
						))}
					</select>
				</div>

				<div className="flex gap-3 mt-6">
					<button
						type="submit"
						disabled={isLoading}
						className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-2 rounded-lg duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isLoading ? "Saving..." : course ? "Save" : "Add Course"}
					</button>
					{course && (
						<button
							type="button"
							onClick={handleDelete}
							disabled={isLoading}
							className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium py-2 rounded-lg duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Delete
						</button>
					)}
					<button
						type="button"
						onClick={() => {
							setCourseName(course?.name || "");
							setCourseType(course?.type || "");
							onClose();
						}}
						disabled={isLoading}
						className="flex-1 border border-border hover:bg-[#1F2324] text-muted font-medium py-2 rounded-lg duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Cancel
					</button>
				</div>
			</form>
		</Modal>
	);
};

export default CourseModal;
