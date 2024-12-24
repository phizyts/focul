"use client";
import SecondaryButton from "@/components/ui/buttons/SecondaryButton";
import { Courses } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CreateCourse } from "../modals/CreateCourse";
import { useModal } from "@/hooks/useModal";
import PrimaryButton from "../buttons/PrimaryButton";
import { CourseFilterDropdown } from "./CourseFilterDropdown";

const CourseActions = () => {
	const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const [isCreating, setIsCreating] = useState(false);
	const [courseName, setCourseName] = useState("");
	const [courseType, setCourseType] = useState("Regular" as Courses["type"]);
	const { isOpen, openModal, closeModal, page } = useModal([
		<CreateCourse
			courseName={courseName}
			setCourseName={setCourseName}
			courseType={courseType}
			setCourseType={setCourseType}
		/>,
	]);
	const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
	const filterRef = useRef<HTMLDivElement>(null);

	const handleSave = async () => {
		setIsCreating(true);
		if (courseName !== "") {
			await fetch(`/api/courses`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: courseName,
					type: courseType,
				}),
			});
			setIsCreating(false);
			closeModal();
			router.refresh();
		} else {
			setIsCreating(false);
			closeModal();
		}
	};

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setDropdownIsOpen(false);
			}
			if (
				filterRef.current &&
				!filterRef.current.contains(event.target as Node)
			) {
				setFilterDropdownOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<>
			<div className="xs:flex items-center gap-2 hidden">
				<div ref={filterRef} className="relative">
					<SecondaryButton
						text="Filter"
						icon="ri-filter-2-line"
						extraClasses="flex gap-1 items-center !mt-0"
						onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
					/>
					<div className="absolute left-0">
						<CourseFilterDropdown
							isOpen={filterDropdownOpen}
							onClose={() => setFilterDropdownOpen(false)}
						/>
					</div>
				</div>
				<SecondaryButton
					text="Import"
					icon="ri-upload-cloud-line"
					extraClasses="flex gap-1 items-center !mt-0"
				/>
				<SecondaryButton
					text="Add Course"
					icon="ri-add-line"
					extraClasses="flex gap-1 items-center !mt-0"
					onClick={openModal}
				/>
			</div>
			<div className="relative xs:hidden" ref={dropdownRef}>
				<i
					onClick={() => setDropdownIsOpen(!isOpen)}
					className="ri-more-2-line text-muted duration-200 hover:bg-[#F5F5F5] cursor-pointer rounded-[8px] border border-border p-2"
				/>
				{dropdownIsOpen && (
					<div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white border border-border z-50">
						<div className="py-1">
							<button
								className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
								onClick={() => {
									setDropdownIsOpen(false);
									setFilterDropdownOpen(!filterDropdownOpen);
								}}
							>
								<i className="ri-filter-2-line mr-2" />
								Filter
							</button>
							<button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
								<i className="ri-upload-cloud-line mr-2" />
								Import
							</button>
							<button
								className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
								onClick={() => {
									setDropdownIsOpen(false);
									openModal();
								}}
							>
								<i className="ri-add-line mr-2" />
								Create Course
							</button>
						</div>
					</div>
				)}
				<div className="absolute right-48 xs:right-0 mt-2">
					<CourseFilterDropdown
						isOpen={filterDropdownOpen}
						onClose={() => setFilterDropdownOpen(false)}
					/>
				</div>
			</div>
			{isOpen && (
				<div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
					<div className="w-full h-full flex items-center justify-center py-4">
						<div
							className="bg-background max-w-[500px] border border-border rounded-lg w-full mx-4 shadow-sm overflow-y-auto sm:overflow-visible"
							onClick={e => e.stopPropagation()}
						>
							<div className="flex h-full flex-col sm:flex-row">
								<div className="flex flex-col w-full">
									<div className="w-full justify-between items-center p-6 h-full min-h-[77px] max-h-[77px] flex">
										<h3 className="flex gap-2 items-center text-xl font-medium">
											<i className="ri-pencil-fill"></i>
											Create Course
										</h3>
										<button
											onClick={() => closeModal()}
											className="text-muted h-[24px] hover:text-primary duration-200"
										>
											<i className="ri-close-line ri-lg"></i>
										</button>
									</div>
									<div className="px-6 h-full overflow-y-auto">{page}</div>
									<div className="flex justify-between gap-3 mt-5 px-6 pb-6">
										<PrimaryButton
											text="Create"
											extraClasses="flex !w-fit"
											type="submit"
											onClick={handleSave}
											isLoading={isCreating}
											extrattributes={{ disabled: isCreating }}
										/>
										<SecondaryButton
											text="Cancel"
											onClick={() => {
												setCourseName("");
												setCourseType("Regular");
												closeModal();
											}}
											type="button"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
export default CourseActions;
