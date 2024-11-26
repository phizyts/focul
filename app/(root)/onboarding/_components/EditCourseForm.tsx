"use client";
import { useState } from "react";

interface EditCourseFormProps {
	course: { name: string; type: string };
	onSubmit: (updatedCourse: { name: string; type: string } | null) => void;
	onClose: () => void;
}

export function EditCourseForm({
	course,
	onSubmit,
	onClose,
}: EditCourseFormProps) {
	const [courseName, setCourseName] = useState(course.name);
	const [courseType, setCourseType] = useState(course.type);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit({ name: courseName, type: courseType });
		onClose();
	};

	const handleDelete = () => {
		onSubmit(null);
		onClose();
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<h2 className="text-xl font-semibold text-white">Edit Course</h2>

			<div>
				<label className="block text-sm font-medium text-gray-300">
					Course Type
				</label>
				<select
					value={courseType}
					onChange={e => setCourseType(e.target.value)}
					className="mt-1 block w-full rounded-md border-gray-600 bg-[#2a2d31] px-3 py-2 text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				>
					<option value="Regular">Regular Course</option>
					<option value="AP">AP Course</option>
					<option value="IB">IB Course</option>
					<option value="Honors">Honors Course</option>
				</select>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-300">
					Course Name
				</label>
				<input
					type="text"
					value={courseName}
					onChange={e => setCourseName(e.target.value)}
					className="mt-1 block w-full rounded-md border-gray-600 bg-[#2a2d31] px-3 py-2 text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					placeholder="Enter course name"
					required
				/>
			</div>

			<div className="flex justify-between space-x-3 pt-4">
				<button
					type="button"
					onClick={handleDelete}
					className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
				>
					Delete
				</button>
				<div className="flex space-x-3">
					<button
						type="button"
						onClick={onClose}
						className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
					>
						Cancel
					</button>
					<button
						type="submit"
						className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
					>
						Save Changes
					</button>
				</div>
			</div>
		</form>
	);
}
