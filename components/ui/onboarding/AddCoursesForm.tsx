import SecondaryButton from "@/components/SecondaryButton";
import dynamic from "next/dynamic";
import { useState } from "react";

const CourseModal = dynamic(() =>
	import("@/components/ui/modal/modals/CourseModal").then(mod => mod.default),
);

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
	const [isModalOpen, setIsModalOpen] = useState(false);
	const closeModal = () => {
		updateData({ selectedCourse: undefined });
		setIsModalOpen(false);
	};
	const handleCourseClick = (course: Course) => {
		updateData({ selectedCourse: course });
		setIsModalOpen(true);
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
									updateData({ selectedCourse: undefined });
								}}
							/>
						)}
					</div>
				</div>
			</div>
			<CourseModal
				key={
					data.selectedCourse
						? `${data.selectedCourse.name}-${data.selectedCourse.type}`
						: "new"
				}
				isOpen={isModalOpen}
				onClose={closeModal}
				course={data.selectedCourse}
				onSubmit={course => {
					if (data.selectedCourse === undefined) {
						updateData({
							courses: [...data.courses, course],
						});
					} else {
						if (course) {
							updateData({
								courses: data.courses.map((c: Course) =>
									c.name === data.selectedCourse?.name ? course : c,
								),
							});
						} else {
							updateData({
								courses: data.courses.filter(
									(c: Course) => c.name !== data.selectedCourse?.name,
								),
							});
						}
					}
				}}
			/>
		</>
	);
};
export default AddCoursesForm;
