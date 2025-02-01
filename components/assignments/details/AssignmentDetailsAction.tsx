"use client";

import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import SecondaryButton from "@/components/ui/buttons/SecondaryButton";
import { useModal } from "@/hooks/useModal";
import { AssignmentType, Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import EditAssignment from "../EditAssignment";
import SetGrade from "../SetGrade";
import toast from "react-hot-toast";

const AssignmentDetailsAction = ({
	assignment,
	assignmentTypes,
}: {
	assignment: Prisma.AssignmentsGetPayload<{
		include: { assignmentType: true };
	}>;
	assignmentTypes: AssignmentType[];
}) => {
	const router = useRouter();
	const [isSaving, setIsSaving] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [name, setName] = useState(assignment.name);
	const [description, setDescription] = useState(assignment.description);
	const [maxGrade, setMaxGrade] = useState(assignment.maxGrade);
	const [dueDate, setDueDate] = useState(new Date(assignment.dueDate));
	const [type, setType] = useState(assignment.assignmentType.name);
	const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [grade, setGrade] = useState<number>(assignment.grade || 0);

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

	const { isOpen, openModal, closeModal, page, currentPage, changePage } =
		useModal([
			<EditAssignment
				name={name}
				setName={setName}
				type={type as string}
				setType={setType}
				description={description as string}
				setDescription={setDescription}
				dueDate={dueDate as Date}
				setDueDate={setDueDate}
				maxGrade={maxGrade}
				setMaxGrade={setMaxGrade}
				assignmentTypes={assignmentTypes as AssignmentType[]}
			/>,
			<SetGrade maxGrade={maxGrade} grade={grade} setGrade={setGrade} />,
		]);

	const handleSave = async () => {
		setIsSaving(true);
		if (name !== "") {
			await fetch(`/api/assignments`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name,
					type,
					description,
					maxGrade,
					dueDate: dueDate,
					assignmentId: assignment.id,
					assignmentTypes,
					courseId: assignment.courseId,
				}),
			});
			closeModal();
			router.refresh();
			setIsSaving(false);
			await fetch(`/api/courses/calculate-average`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					courseId: assignment.courseId,
				}),
			});
			toast.success("Assignment updated successfully");
		} else {
			setIsSaving(false);
			closeModal();
		}
	};

	const handleMarkDone = async () => {
		setIsSaving(true);
		try {
			await fetch(`/api/assignments/update`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					assignmentId: assignment.id,
					status: "Completed",
				}),
			});
			window.location.reload();
			toast.success("Assignment has marked as done");
		} catch (error) {
			setIsSaving(false);
		}
	};

	const handleMarkPending = async () => {
		setIsSaving(true);
		try {
			await fetch(`/api/assignments/update`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					assignmentId: assignment.id,
					status: "Pending",
				}),
			});
			window.location.reload();
			toast.success("Assignment has marked as pending");
		} catch (error) {
			setIsSaving(false);
		}
	};

	const handleMarkGraded = async () => {
		setIsSaving(true);
		try {
			await fetch(`/api/assignments/update`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					assignmentId: assignment.id,
					status: "Graded",
					grade: grade !== null ? grade : 0,
					courseId: assignment.courseId,
				}),
			});
			window.location.reload();
			toast.success("Assignment has marked as graded");
		} catch (error) {
			setIsSaving(false);
		}
	};

	const handleDelete = async () => {
		setIsDeleting(true);
		await fetch(`/api/assignments`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				assignmentId: assignment.id,
			}),
		});
		setIsDeleting(false);
		closeModal();
		await fetch(`/api/courses/calculate-average`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				courseId: assignment.courseId,
			}),
		});
		router.push(`/courses/my/${assignment.courseId}`);
		toast.success("Assignment deleted successfully");
	};

	return (
		<>
			<div className="gap-2 items-center hidden xs:flex">
				{(assignment.status === "Completed" ||
					assignment.status === "Graded") && (
					<SecondaryButton
						text="Set Grade"
						icon="ri-scales-fill"
						extraClasses="flex gap-1 items-center !mt-0 hidden xs:flex text-nowrap"
						onClick={() => {
							changePage(2);
							openModal();
						}}
					/>
				)}
				<SecondaryButton
					text="Edit"
					icon="ri-pencil-line"
					extraClasses="flex gap-1 items-center !mt-0 hidden xs:flex"
					onClick={() => {
						changePage(1);
						openModal();
					}}
				/>
				{assignment.status === "Pending" || assignment.status === "Overdue" ? (
					<PrimaryButton
						text="Mark Done"
						icon="ri-check-fill"
						extraClasses="flex gap-1 items-center !mt-0 hidden xs:flex"
						onClick={handleMarkDone}
						isLoading={isSaving}
						extraAttributes={{
							disabled: isSaving,
						}}
					/>
				) : (
					<PrimaryButton
						text="Mark Pending"
						icon="ri-check-fill"
						extraClasses="flex gap-1 items-center !mt-0 hidden xs:flex"
						onClick={handleMarkPending}
						isLoading={isSaving}
						extraAttributes={{
							disabled: isSaving,
						}}
					/>
				)}
			</div>
			<div className="relative xs:hidden" ref={dropdownRef}>
				<i
					onClick={() => setDropdownIsOpen(!dropdownIsOpen)}
					className="ri-more-2-line text-muted duration-200 hover:bg-[#F5F5F5] cursor-pointer rounded-[8px] border border-border p-2"
				/>
				{dropdownIsOpen && (
					<div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white border border-border z-50">
						<div className="py-1" role="menu" aria-orientation="vertical">
							{(assignment.status === "Completed" ||
								assignment.status === "Graded") && (
								<button
									className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
									onClick={() => {
										setDropdownIsOpen(false);
										changePage(2);
										openModal();
									}}
								>
									<i className="ri-scales-fill mr-2" />
									Set Grade
								</button>
							)}
							<button
								className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
								onClick={() => {
									setDropdownIsOpen(false);
									changePage(1);
									openModal();
								}}
							>
								<i className="ri-pencil-line mr-2" />
								Edit
							</button>
							{assignment.status === "Pending" ||
							assignment.status === "Overdue" ? (
								<button
									className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
									onClick={() => {
										setDropdownIsOpen(false);
										handleMarkDone();
									}}
								>
									<i className="ri-check-line mr-2" />
									Mark Done
								</button>
							) : (
								<button
									className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
									onClick={() => {
										setDropdownIsOpen(false);
										handleMarkPending();
									}}
								>
									<i className="ri-check-line mr-2" />
									Mark Pending
								</button>
							)}
						</div>
					</div>
				)}
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
											<i
												className={
													currentPage === 1
														? "ri-pencil-fill"
														: "ri-scales-fill"
												}
											></i>
											{currentPage === 1 ? "Edit Assignment" : "Set Grade"}
										</h3>
										<button
											onClick={() => {
												setName(assignment.name);
												setType(assignment.assignmentType.name);
												setDescription(assignment.description);
												setDueDate(new Date(assignment.dueDate));
												setMaxGrade(assignment.maxGrade);
												closeModal();
											}}
											className="text-muted h-[24px] hover:text-primary duration-200"
										>
											<i className="ri-close-line ri-lg"></i>
										</button>
									</div>
									<div className="px-6 h-full overflow-y-auto">{page}</div>
									{currentPage === 1 && (
										<div className="flex justify-between gap-3 mt-5 px-6 pb-6">
											<PrimaryButton
												text="Save"
												extraClasses={`flex !w-fit ${assignmentTypes.length === 0 && "cursor-not-allowed !bg-muted"}`}
												type="submit"
												isLoading={isSaving}
												extraAttributes={{
													disabled: isSaving || assignmentTypes.length === 0,
												}}
												onClick={handleSave}
											/>
											<div className="flex gap-2 items-center">
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
												<SecondaryButton
													text="Cancel"
													onClick={() => {
														setName(assignment.name);
														setType(assignment.assignmentType.name);
														setDescription(assignment.description);
														setDueDate(new Date(assignment.dueDate));
														setMaxGrade(assignment.maxGrade);
														closeModal();
													}}
													type="button"
												/>
											</div>
										</div>
									)}
									{currentPage === 2 && (
										<div className="flex justify-between gap-3 mt-5 px-6 pb-6">
											<PrimaryButton
												text="Save"
												onClick={handleMarkGraded}
												extraClasses="!w-fit"
												isLoading={isSaving}
												extraAttributes={{
													disabled: isSaving,
												}}
											/>
											<SecondaryButton
												text="Cancel"
												onClick={() => {
													setGrade(assignment.grade || 0);
													closeModal();
												}}
												type="button"
											/>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
export default AssignmentDetailsAction;
