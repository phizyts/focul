"use client";
import SecondaryButton from "@/components/ui/buttons/SecondaryButton";
import {
	AssignmentType,
	Courses,
	GradingPolicy as GradingPolicyType,
} from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CreateCourse } from "./CreateCourse";
import { useModal } from "@/hooks/useModal";
import { CourseFilterDropdown } from "./CourseFilterDropdown";
import { ManageGrading } from "./ManageGrading";
import Modal from "@/components/Modal";
import PrimaryButton from "../ui/buttons/PrimaryButton";
import {
	ExtendedGradingPolicy,
	GradingPoliciesWithAGPId,
} from "@/types/course.types";
import { ConfirmPolicyChange } from "./ConfirmPolicyChange";
import toast from "react-hot-toast";

const CourseActions = ({
	gradingPoliciesWithAGPId,
}: {
	gradingPoliciesWithAGPId: GradingPoliciesWithAGPId;
}) => {
	const initialAGP = gradingPoliciesWithAGPId.gradingPolicy.find(
		(policy: ExtendedGradingPolicy) =>
			policy.id === gradingPoliciesWithAGPId.agpId,
	);
	const [activeGradingPolicy, setActiveGradingPolicy] =
		useState<ExtendedGradingPolicy | null>(initialAGP || null);
	const [assignmentTypes, setAssignmentTypes] = useState(
		initialAGP?.assignmentTypes || [],
	);
	const [isCustom, setIsCustom] = useState(
		activeGradingPolicy?.name !== "HSTAT",
	);

	const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const [isSaving, setIsSaving] = useState(false);
	const [courseName, setCourseName] = useState("");
	const [courseType, setCourseType] = useState("Regular" as Courses["type"]);
	const [pendingGradingChanges, setPendingGradingChanges] = useState<{
		policyId: string | undefined;
		isCustom: boolean;
		assignmentTypes: any[];
	} | null>(null);

	const { isOpen, openModal, closeModal, page, currentPage, changePage } =
		useModal([
			<CreateCourse
				courseName={courseName}
				setCourseName={setCourseName}
				courseType={courseType}
				setCourseType={setCourseType}
			/>,
			<ManageGrading
				gradingPoliciesWithAGPId={
					gradingPoliciesWithAGPId as {
						gradingPolicy: (GradingPolicyType & {
							assignmentTypes: AssignmentType[];
						})[];
						agpId: string;
					}
				}
				activeGradingPolicy={activeGradingPolicy}
				setActiveGradingPolicy={setActiveGradingPolicy}
				assignmentTypes={assignmentTypes}
				setAssignmentTypes={setAssignmentTypes}
				isCustom={isCustom}
				setIsCustom={setIsCustom}
			/>,
			<ConfirmPolicyChange
				onConfirm={async () => {
					if (pendingGradingChanges) {
						await saveGradingPolicy(pendingGradingChanges.assignmentTypes);
						setPendingGradingChanges(null);
					}
					changePage(2);
				}}
				onCancel={() => {
					setPendingGradingChanges(null);
					changePage(2);
				}}
				isLoading={isSaving}
			/>,
		]);
	const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
	const filterRef = useRef<HTMLDivElement>(null);

	const hasUnsavedChanges = () => {
		if ((initialAGP?.name !== "HSTAT") !== isCustom) return true;
		if (activeGradingPolicy?.id !== initialAGP?.id) return true;

		const validAssignmentTypes = assignmentTypes.filter(
			type => type.name.trim() !== "",
		);
		const validInitialTypes = initialAGP?.assignmentTypes || [];

		if (validAssignmentTypes.length !== validInitialTypes.length) return true;

		return validAssignmentTypes.some((type, index) => {
			if (type.id.includes("new-")) return true;
			const initialType = validInitialTypes.find(t => t.id === type.id);
			if (!initialType) return true;
			return (
				type.name !== initialType.name || type.weight !== initialType.weight
			);
		});
	};

	const handleCloseGradingModal = () => {
		setActiveGradingPolicy(initialAGP || null);
		setAssignmentTypes(initialAGP?.assignmentTypes || []);
		setIsCustom(initialAGP?.name !== "HSTAT");
		closeModal();
	};

	const reset = () => {
		setCourseName("");
		setCourseType("Regular");
	};

	const handleCreateCourse = async () => {
		setIsSaving(true);
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
			setIsSaving(false);
			closeModal();
			reset();
			router.refresh();
			toast.success("Course created successfully");
		} else {
			setIsSaving(false);
			reset();
			closeModal();
		}
	};

	const handleSaveGradingPolicy = async () => {
		if (hasUnsavedChanges()) {
			const validAssignmentTypes = assignmentTypes
				.filter(type => type.name.trim() !== "")
				.map(type => ({
					id: type.id,
					name: type.name,
					weight: type.weight,
				}));

			if (activeGradingPolicy?.id !== initialAGP?.id) {
				setPendingGradingChanges({
					policyId: activeGradingPolicy?.id,
					isCustom,
					assignmentTypes: validAssignmentTypes,
				});
				changePage(3);
				return;
			}

			await saveGradingPolicy(validAssignmentTypes);
		} else {
			setIsSaving(false);
			closeModal();
		}
	};

	const saveGradingPolicy = async (validAssignmentTypes: any[]) => {
		setIsSaving(true);
		try {
			const response = await fetch(`/api/grading-policies`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					policyId: activeGradingPolicy?.id,
					isCustom,
					assignmentTypes: validAssignmentTypes,
				}),
			});

			if (response.ok) {
				const updatedPolicy = await response.json();
				setActiveGradingPolicy(updatedPolicy);
				setAssignmentTypes(updatedPolicy.assignmentTypes || []);
				setIsCustom(updatedPolicy.name !== "HSTAT");
			}

			router.refresh();
			closeModal();
		} catch (error) {
			toast.error("Error saving grading policy");
		} finally {
			setIsSaving(false);
			toast.success("Grading policy saved successfully");
		}
	};

	useEffect(() => {
		setActiveGradingPolicy(initialAGP || null);
		setAssignmentTypes(initialAGP?.assignmentTypes || []);
		setIsCustom(initialAGP?.name !== "HSTAT");
	}, [gradingPoliciesWithAGPId]);

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
					text="Grading"
					icon="ri-bar-chart-2-line"
					extraClasses="flex gap-1 items-center !mt-0"
					onClick={() => {
						changePage(2);
						openModal();
					}}
				/>
				<SecondaryButton
					text="Add Course"
					icon="ri-add-line"
					extraClasses="flex gap-1 items-center !mt-0"
					onClick={() => {
						changePage(1);
						openModal();
					}}
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
							<button
								className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
								onClick={() => {
									setDropdownIsOpen(false);
									changePage(2);
									openModal();
								}}
							>
								<i className="ri-bar-chart-2-line mr-2" />
								Grading
							</button>
							<button
								className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
								onClick={() => {
									setDropdownIsOpen(false);
									changePage(1);
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
			{isOpen && currentPage === 1 && (
				<Modal extraClasses="max-w-[500px]">
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
								onClick={handleCreateCourse}
								isLoading={isSaving}
								extraAttributes={{ disabled: isSaving }}
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
				</Modal>
			)}
			{isOpen && currentPage === 2 && (
				<Modal extraClasses="max-w-[500px] max-h-[570px]">
					<div className="flex flex-col w-full pb-8">
						<div className="pt-6 pb-5 px-6">
							<div className="w-full justify-between items-center flex relative">
								<h3 className="flex gap-2 items-center text-xl font-medium">
									<i className="ri-bar-chart-fill"></i>
									Manage Grading
								</h3>
								<button
									onClick={handleCloseGradingModal}
									className="text-muted h-[24px] hover:text-primary duration-200"
								>
									<i className="ri-close-line ri-lg"></i>
								</button>
								{hasUnsavedChanges() && (
									<PrimaryButton
										text="Save"
										type="submit"
										extraClasses="absolute !w-fit -top-1 right-8 !m-0"
										extraAttributes={{
											disabled: isSaving,
										}}
										isLoading={isSaving}
										onClick={handleSaveGradingPolicy}
									/>
								)}
							</div>
							<p className="text-sm text-muted mt-1">
								Configure grading policy and assignment types
							</p>
						</div>
						<div className="px-6 h-full overflow-y-auto">{page}</div>
					</div>
				</Modal>
			)}
			{isOpen && currentPage === 3 && (
				<Modal extraClasses="max-w-[500px]">
					<div className="flex flex-col w-full">
						<div className="w-full justify-between items-center p-6 h-full min-h-[77px] max-h-[77px] flex">
							<h3 className="flex gap-2 items-center text-xl font-medium">
								<i className="ri-alert-fill text-[#b80404]"></i>
								Confirm Policy Change
							</h3>
							<button
								onClick={() => changePage(2)}
								className="text-muted h-[24px] hover:text-primary duration-200"
							>
								<i className="ri-close-line ri-lg"></i>
							</button>
						</div>
						<div className="px-6 pb-6">{page}</div>
					</div>
				</Modal>
			)}
		</>
	);
};
export default CourseActions;
