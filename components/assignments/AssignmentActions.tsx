"use client";

import { useRef, useState, useEffect } from "react";
import { AssignmentStatus, Courses } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import FilterButton from "@/components/ui/buttons/FilterButton";
import { FilterDropdown } from "@/components/ui/buttons/FilterDropdown";

const AssignmentActions = ({ courses }: { courses: Courses[] }) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [courseFilterOpen, setCourseFilterOpen] = useState(false);
	const [statusFilterOpen, setStatusFilterOpen] = useState(false);
	const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
	const courseFilterRef = useRef<HTMLDivElement>(null);
	const statusFilterRef = useRef<HTMLDivElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const currentCourse = searchParams.get("course");
	const currentStatus = searchParams.get("status");

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				courseFilterRef.current &&
				!courseFilterRef.current.contains(event.target as Node)
			) {
				setCourseFilterOpen(false);
			}
			if (
				statusFilterRef.current &&
				!statusFilterRef.current.contains(event.target as Node)
			) {
				setStatusFilterOpen(false);
			}
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setDropdownIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleFilterSelect = (
		type: "course" | "status",
		value: string | null,
	) => {
		const params = new URLSearchParams(searchParams.toString());
		if (value) {
			params.set(type, value);
		} else {
			params.delete(type);
		}
		router.push(`?${params.toString()}`);
	};

	const courseOptions = courses.map(course => ({
		id: course.id,
		name: course.name,
	}));

	return (
		<div className="flex gap-4">
			<div className="xs:flex items-center gap-2 hidden">
				<div ref={courseFilterRef} className="relative">
					<FilterButton
						text="Course"
						isOpen={courseFilterOpen}
						onClick={() => setCourseFilterOpen(!courseFilterOpen)}
					/>
					<FilterDropdown
						isOpen={courseFilterOpen}
						onClose={() => setCourseFilterOpen(false)}
						options={courseOptions}
						currentValue={currentCourse}
						onSelect={value => handleFilterSelect("course", value)}
						title="Filter by Course"
					/>
				</div>
				<div ref={statusFilterRef} className="relative">
					<FilterButton
						text="Status"
						isOpen={statusFilterOpen}
						onClick={() => setStatusFilterOpen(!statusFilterOpen)}
					/>
					<FilterDropdown
						isOpen={statusFilterOpen}
						onClose={() => setStatusFilterOpen(false)}
						options={[
							{ id: AssignmentStatus.Pending, name: "Pending" },
							{ id: AssignmentStatus.Completed, name: "Completed" },
							{ id: AssignmentStatus.Graded, name: "Graded" },
							{ id: AssignmentStatus.Overdue, name: "Overdue" },
						]}
						currentValue={currentStatus}
						onSelect={value => handleFilterSelect("status", value)}
						title="Filter by Status"
					/>
				</div>
			</div>
			<div className="relative xs:hidden" ref={dropdownRef}>
				<i
					onClick={() => setDropdownIsOpen(!dropdownIsOpen)}
					className="ri-more-2-line text-muted duration-200 hover:bg-[#F5F5F5] cursor-pointer rounded-[8px] border border-border p-2"
				/>
				{dropdownIsOpen && (
					<div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white border border-border z-50">
						<div className="py-1">
							<button
								className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
								onClick={() => {
									setDropdownIsOpen(false);
									setCourseFilterOpen(!courseFilterOpen);
								}}
							>
								<i className="ri-filter-2-line mr-2" />
								Course Filter
							</button>
							<button
								className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
								onClick={() => {
									setDropdownIsOpen(false);
									setStatusFilterOpen(!statusFilterOpen);
								}}
							>
								<i className="ri-filter-2-line mr-2" />
								Status Filter
							</button>
						</div>
					</div>
				)}
				<div className="absolute right-48 xs:right-0 mt-2">
					<FilterDropdown
						isOpen={courseFilterOpen}
						onClose={() => setCourseFilterOpen(false)}
						options={courseOptions}
						currentValue={currentCourse}
						onSelect={value => handleFilterSelect("course", value)}
						title="Filter by Course"
					/>
				</div>
				<div className="absolute right-48 xs:right-0 mt-2">
					<FilterDropdown
						isOpen={statusFilterOpen}
						onClose={() => setStatusFilterOpen(false)}
						options={[
							{ id: AssignmentStatus.Pending, name: "Pending" },
							{ id: AssignmentStatus.Completed, name: "Completed" },
							{ id: AssignmentStatus.Graded, name: "Graded" },
							{ id: AssignmentStatus.Overdue, name: "Overdue" },
						]}
						currentValue={currentStatus}
						onSelect={value => handleFilterSelect("status", value)}
						title="Filter by Status"
					/>
				</div>
			</div>
		</div>
	);
};

export default AssignmentActions;
