import SecondaryButton from "@/components/ui/buttons/SecondaryButton";
import { useState } from "react";
import { CreateCourse } from "@/components/courses/CreateCourse";
import { EditCourse } from "@/components/courses/EditCourse";
import { Courses } from "@prisma/client";
import PrimaryButton from "../ui/buttons/PrimaryButton";

interface Course {
	name: string;
	type: "AP" | "IB" | "Honors" | "Regular";
}

const AddCoursesForm = ({
	data,
	updateData,
}: {
	data: any;
	updateData: any;
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [courseName, setCourseName] = useState(data.selectedCourse?.name || "");
	const [courseType, setCourseType] = useState(
		data.selectedCourse?.type || "Regular",
	);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);

	const closeModal = () => {
		updateData({ selectedCourse: undefined });
		setIsModalOpen(false);
		setIsEditMode(false);
		setCourseName("");
		setCourseType("Regular");
	};

	const handleCourseClick = (course: Course) => {
		setCourseName(course.name);
		setCourseType(course.type);
		updateData({ selectedCourse: course });
		setIsEditMode(true);
		setIsModalOpen(true);
	};

	const handleUpdateCourse = (updatedCourse: Course | null) => {
		if (!data.selectedCourse) return;

		if (updatedCourse === null) {
			const updatedCourses = data.courses.filter(
				(course: Course) => course.name !== data.selectedCourse.name,
			);
			updateData({ courses: updatedCourses });
		} else {
			const updatedCourses = data.courses.map((course: Course) =>
				course.name === data.selectedCourse.name ? updatedCourse : course,
			);
			updateData({ courses: updatedCourses });
		}
		closeModal();
	};

	return (
		<>
			<div className="mt-5">
				<h1 className="text-2xl font-medium">Add your courses</h1>
				<p className="text-muted">Please select your courses to proceed</p>
				<div className="flex justify-between items-center mt-2">
					<span className="text-muted text-xs">
						{data.courses.length}/10 Courses
					</span>
					<button
						className="flex items-center gap-1 text-xs text-muted"
						onClick={() => {
							updateData({ courses: [] });
						}}
					>
						<i className="ri-delete-bin-line"></i>
						Remove All
					</button>
				</div>
				<div>
					<div className="grid grid-cols-2 grid-rows-1 gap-3 mt-2">
						{data.courses.map((course: Course, index: number) => (
							<SecondaryButton
								key={index}
								text={course.name}
								extraClasses="text-md flex items-center gap-2 mt-0"
								icon="ri-graduation-cap-fill"
								onClick={() => handleCourseClick(course)}
							/>
						))}
						{data.courses.length < 10 && (
							<SecondaryButton
								text="Add Course"
								icon="ri-add-line"
								extraClasses="text-md flex gap-2 items-center justify-center mt-0"
								onClick={() => {
									setIsModalOpen(true);
									setIsEditMode(false);
									updateData({ selectedCourse: undefined });
								}}
							/>
						)}
					</div>
				</div>
			</div>
			{isModalOpen && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
					<div className="bg-background rounded-lg p-6 w-full max-w-md">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-medium">
								{isEditMode ? "Edit Course" : "Add Course"}
							</h2>
							<button
								onClick={closeModal}
								className="text-muted hover:text-primary"
							>
								<i className="ri-close-line text-xl"></i>
							</button>
						</div>
						{isEditMode ? (
							<div>
								<EditCourse
									course={data.selectedCourse as Courses}
									courseName={courseName}
									setCourseName={setCourseName}
									courseType={courseType}
									setCourseType={setCourseType}
								/>
								<div className="flex justify-between gap-3 mt-4">
									<PrimaryButton
										text={isLoading ? "Saving..." : "Save"}
										onClick={() =>
											handleUpdateCourse({
												name: courseName,
												type: courseType,
											})
										}
										extraClasses="!w-fit"
									/>
									<div className="flex gap-3">
										<PrimaryButton
											text="Delete"
											extraClasses="!w-fit !bg-[#b80404]"
											onClick={() => handleUpdateCourse(null)}
										/>
										<SecondaryButton text="Cancel" onClick={closeModal} />
									</div>
								</div>
							</div>
						) : (
							<div>
								<CreateCourse
									courseName={courseName}
									setCourseName={setCourseName}
									courseType={courseType}
									setCourseType={setCourseType}
								/>
								<div className="flex justify-between gap-3 mt-4">
									<PrimaryButton
										text={isLoading ? "Saving..." : "Add Course"}
										onClick={() => {
											if (courseName && courseType) {
												updateData({
													courses: [
														...data.courses,
														{ name: courseName, type: courseType },
													],
												});
												closeModal();
											}
										}}
										extraClasses="!w-fit"
									/>
									<SecondaryButton text="Cancel" onClick={closeModal} />
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
};

export default AddCoursesForm;
