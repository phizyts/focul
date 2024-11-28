"use client";
import { useState } from "react";

interface CourseFormProps {
	onSubmit: (course: { name: string; type: string }) => void;
	onClose: () => void;
}

export function AddCourseForm({ onSubmit, onClose }: CourseFormProps) {
	const [courseName, setCourseName] = useState("");
	const [courseType, setCourseType] = useState("Regular");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit({ name: courseName, type: courseType });
		onClose();
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<h2 className="text-xl font-semibold text-white">Add New Course</h2>

			<div>
				<label className="block text-sm font-medium text-gray-300">
					Course Type
				</label>
				<div className="relative">
					<select
						value={courseType}
						onChange={e => setCourseType(e.target.value)}
						className="mt-1 block w-full appearance-none rounded-lg border border-[#3B4245] bg-[#1A1D1E] pl-4 pr-10 py-2 text-gray-300 shadow-sm focus:border-[#3B4245] focus:outline-none focus:ring-1 focus:ring-[#3B4245] transition-colors"
					>
						<option value="Regular">Regular Course</option>
						<option value="AP">AP Course</option>
						<option value="IB">IB Course</option>
						<option value="Honors">Honors Course</option>
					</select>
					<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 mt-1 text-gray-300">
						<i className="ri-arrow-drop-down-line ri-lg"></i>
					</div>
				</div>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-300">
					Course Name
				</label>
				<input
					type="text"
					value={courseName}
					onChange={e => setCourseName(e.target.value)}
					className="mt-1 block w-full rounded-lg border border-[#3B4245] bg-[#1A1D1E] px-4 py-2 text-gray-300 shadow-sm focus:border-[#3B4245] focus:outline-none focus:ring-1 focus:ring-[#3B4245] transition-colors"
					placeholder="Enter course name"
					required
				/>
			</div>

			<div className="flex justify-end space-x-3 pt-4">
				<button
					type="button"
					onClick={onClose}
					className="rounded-lg border border-[#3B4245] bg-[#1A1D1E] px-4 py-2 text-sm font-medium text-gray-300 transition-colors"
				>
					Cancel
				</button>
				<button
					type="submit"
					className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors"
				>
					Add Course
				</button>
			</div>
		</form>
	);
}
