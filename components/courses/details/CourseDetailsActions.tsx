"use client";

import SecondaryButton from "@/components/ui/buttons/SecondaryButton";
import { EditCourse } from "@/components/courses/EditCourse";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import { useModal } from "@/hooks/useModal";
import { Courses } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Modal from "@/components/Modal";
import toast from "react-hot-toast";
import { deleteCourse, updateCourse } from "@/action/course.action";

const CourseDetailsActions = ({ course }: { course: Courses }) => {
	const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const [isSaving, setIsSaving] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [courseName, setCourseName] = useState(course?.name);
	const [courseType, setCourseType] = useState(course?.type);
	const { isOpen, openModal, closeModal, page } = useModal([
		<EditCourse
			course={course}
			setCourseName={setCourseName}
			setCourseType={setCourseType}
			courseName={courseName}
			courseType={courseType}
		/>,
	]);

	const handleSave = async () => {
		setIsSaving(true);
		if (courseName !== course?.name || courseType !== course?.type) {
			const { success } = await updateCourse(courseName, courseType, course.id);
			if (success) {
				closeModal();
				router.refresh();
				toast.success("Course updated successfully");
			} else {
				closeModal();
				router.refresh();
				toast.error("Failed to update course");
			}
			setIsSaving(false);
		} else {
			setIsSaving(false);
			closeModal();
		}
	};

	const handleDelete = async () => {
		setIsDeleting(true);
		const { success } = await deleteCourse(course.id);
		if (success) {
			closeModal();
			router.refresh();
			toast.success("Course deleted successfully");
		} else {
			closeModal();
			router.refresh();
			toast.error("Failed to delete course");
		}
		setIsDeleting(false);
	};

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
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

	return (
		<>
			<div className="gap-2 items-center hidden xs:flex">
				<SecondaryButton
					text="Import"
					icon="ri-upload-cloud-line"
					extraClasses="gap-1 items-center !mt-0"
				/>
				<SecondaryButton
					text="Edit"
					icon="ri-pencil-line"
					extraClasses="flex gap-1 items-center !mt-0 hidden xs:flex"
					onClick={() => openModal()}
				/>
			</div>
			<div className="relative xs:hidden" ref={dropdownRef}>
				<i
					onClick={() => setDropdownIsOpen(!isOpen)}
					className="ri-more-2-line text-muted duration-200 hover:bg-[#F5F5F5] cursor-pointer rounded-[8px] border border-border p-2"
				/>
				{dropdownIsOpen && (
					<div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white border border-border z-50">
						<div className="py-1" role="menu" aria-orientation="vertical">
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
								<i className="ri-pencil-line mr-2" />
								Edit
							</button>
						</div>
					</div>
				)}
			</div>
			{isOpen && (
				<Modal extraClasses="max-w-[500px]">
					<div className="flex flex-col w-full">
						<div className="w-full justify-between items-center p-6 h-full min-h-[77px] max-h-[77px] flex">
							<h3 className="flex gap-2 items-center text-xl font-medium">
								<i className="ri-pencil-fill"></i>
								Edit Course
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
								text="Save"
								extraClasses="flex !w-fit"
								type="submit"
								onClick={handleSave}
								isLoading={isSaving}
								extraAttributes={{
									disabled: isSaving || isDeleting,
								}}
							/>
							<div className="flex gap-3">
								{course && (
									<PrimaryButton
										text="Delete"
										extraClasses="flex !w-fit !bg-[#b80404]"
										type="button"
										onClick={handleDelete}
										isLoading={isDeleting}
										extraAttributes={{
											disabled: isDeleting || isSaving,
										}}
									/>
								)}
								<SecondaryButton
									text="Cancel"
									onClick={() => {
										setCourseName(course?.name || "");
										setCourseType(course?.type || "Regular");
										closeModal();
									}}
									type="button"
								/>
							</div>
						</div>
					</div>
				</Modal>
			)}
		</>
	);
};

export default CourseDetailsActions;
