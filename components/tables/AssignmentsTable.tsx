"use client";
import { formatDueDate } from "@/utils/formatDueDate";
import { AssignmentType, Prisma } from "@prisma/client";
import { useModal } from "@/hooks/useModal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SecondaryDropdownButton from "../ui/buttons/SecondaryDropdownButton";
import CreateAssignment from "../assignments/CreateAssignment";
import PrimaryButton from "../ui/buttons/PrimaryButton";
import SecondaryButton from "../ui/buttons/SecondaryButton";
import { formatGrade } from "@/utils/formatGrade";

const AssignmentsTable = ({
	courseId,
	assignments,
	assignmentTypes,
}: {
	courseId: string;
	assignments: Prisma.AssignmentsGetPayload<{
		include: { assignmentType: true };
	}>[];
	assignmentTypes: AssignmentType[];
}) => {
	const router = useRouter();
	const [isCreating, setIsCreating] = useState(false);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [maxGrade, setMaxGrade] = useState(100);
	const [dueDate, setDueDate] = useState(
		new Date(Date.now() + 24 * 60 * 60 * 1000),
	);

	const initialType = assignmentTypes.length > 0 ? assignmentTypes[0].name : "";
	const [type, setType] = useState(initialType);

	const { isOpen, openModal, closeModal, page } = useModal([
		<CreateAssignment
			name={name}
			setName={setName}
			type={type}
			setType={setType}
			description={description}
			setDescription={setDescription}
			dueDate={dueDate as Date}
			setDueDate={setDueDate}
			maxGrade={maxGrade}
			setMaxGrade={setMaxGrade}
			assignmentTypes={assignmentTypes as AssignmentType[]}
		/>,
	]);

	const handleCreate = async () => {
		setIsCreating(true);
		if (name !== "") {
			await fetch(`/api/assignments`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name,
					type,
					description,
					maxGrade,
					dueDate: dueDate,
					courseId,
					assignmentTypes,
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

	return (
		<>
			<div className="border border-border rounded-[10px] mt-6 w-full xl3:col-span-2 xl2:col-span-3 overflow-x-auto">
				<div className="flex items-center justify-between my-5">
					<div className="flex items-center gap-2 px-5">
						<i className="ri-book-open-fill text-muted"></i>
						<h2 className="text-muted">Assignments</h2>
					</div>
					<div className="flex items-center px-5">
						<SecondaryDropdownButton
							text="New"
							icon="ri-add-line"
							extraClasses="flex items-center gap-2 !mt-0"
							onClick={openModal}
						/>
					</div>
				</div>
				<table className="w-full min-w-[650px]">
					<thead
						className={`border-t ${assignments.length > 0 ? "border-b" : ""} border-border w-full`}
					>
						<tr className="text-left text-muted">
							<th className="py-2 pl-5 font-normal">Name</th>
							<th className="py-2 font-normal">Category</th>
							<th className="py-2 font-normal">Grade</th>
							<th className="py-2 font-normal">Due Date</th>
							<th className="py-2 font-normal">Status</th>
						</tr>
					</thead>
					<tbody>
						{assignments.map(assignment => (
							<tr
								className="hover:bg-[#F5F5F5] cursor-pointer"
								key={assignment.id}
								onClick={() => {
									window.location.href = `/courses/assignments/${assignment.id}`;
								}}
							>
								<td className="py-3 pl-5 truncate max-w-[130px]">
									{assignment.name}
								</td>
								<td className="py-3">{assignment.assignmentType?.name}</td>
								<td className="py-3">
									{`${formatGrade(assignment?.grade as Number)}/${assignment.maxGrade}`}
								</td>
								<td className="py-3 flex gap-1 items-center">
									<i className="ri-calendar-schedule-fill"></i>
									{formatDueDate(assignment.dueDate)}
								</td>
								<td className="py-3">
									<span
										className={`px-3 py-1 rounded-full text-sm ${
											assignment.status === "Graded"
												? "bg-green-100 text-green-800"
												: assignment.status === "Completed"
													? "bg-blue-100 text-blue-800"
													: assignment.status === "Overdue"
														? "bg-red-100 text-red-800"
														: "bg-yellow-100 text-yellow-800"
										}`}
									>
										{assignment.status}
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
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
											Create Assignment
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
											extraClasses={`flex !w-fit ${assignmentTypes.length === 0 && "cursor-not-allowed !bg-muted"}`}
											type="submit"
											isLoading={isCreating}
											extraAttributes={{
												disabled: isCreating || assignmentTypes.length === 0,
											}}
											onClick={handleCreate}
										/>
										<SecondaryButton
											text="Cancel"
											onClick={() => {
												setName("");
												setType(initialType);
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
export default AssignmentsTable;
