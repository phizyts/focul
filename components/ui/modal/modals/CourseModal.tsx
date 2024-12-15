import { Modal } from "../Modal";
import { useState } from "react";
import { CourseType } from "@prisma/client";
import { courseTypes } from "@/constants/constants";
import PrimaryButton from "../../PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";

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
	const [courseType, setCourseType] = useState(course?.type || "Regular");

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
			setCourseType("Regular");
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
		setCourseType("Regular");
		onClose();
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => {
				setCourseName(course?.name || "");
				setCourseType(course?.type || "Regular");
				onClose();
			}}
			title={course ? "Edit Course" : "Add Course"}
		>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<label className="text-sm text-primary">Course Name</label>
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
					<label className="text-sm text-primary">Course Type</label>
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

				<div className="flex justify-between gap-3 mt-2">
					<PrimaryButton
						text={isLoading ? "Saving..." : course ? "Save" : "Add Course"}
						extraClasses="flex !w-fit"
						type="submit"
					/>
					<div className="flex gap-3">
						{course && (
							<PrimaryButton
								text="Delete"
								extraClasses="flex !w-fit !bg-[#b80404]"
								type="button"
								onClick={handleDelete}
							/>
						)}
						<SecondaryButton
							text="Cancel"
							onClick={() => {
								setCourseName(course?.name || "");
								setCourseType(course?.type || "Regular");
								onClose();
							}}
							type="button"
						/>
					</div>
				</div>
			</form>
		</Modal>
	);
};

export default CourseModal;
