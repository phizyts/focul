"use client";

import Modal from "@/components/Modal";
import ViewTask from "@/components/tasks/ViewTask";
import { useModal } from "@/hooks/useModal";
import { formatDueDate } from "@/utils/formatDueDate";
import { Assignments, Tasks, TaskStatus, User } from "@prisma/client";
import { useState } from "react";
import PrimaryButton from "../buttons/PrimaryButton";
import SecondaryButton from "../buttons/SecondaryButton";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import EditTask from "@/components/tasks/EditTask";
import { deleteTask, updateTask, updateTaskStatus } from "@/action/task.action";

interface TaskCardProps {
	task?: Tasks[];
	assignments?: Assignments[];
	user: User;
}

export default function TaskCard({ task, assignments, user }: TaskCardProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const currentFilter = searchParams.get("filter");
	const currentSort = searchParams.get("sort");
	const userId = user.id;
	const [isLoading, setIsLoading] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [taskName, setTaskName] = useState("");
	const [taskDesc, setTaskDesc] = useState("");
	const [taskType, setTaskType] = useState("");
	const [taskId, setTaskId] = useState("");
	const [taskStatus, setTaskStatus] = useState<TaskStatus | null>(null);
	const [taskDueDate, setTaskDueDate] = useState(new Date());
	const { isOpen, openModal, closeModal, page, currentPage, changePage } =
		useModal([
			<ViewTask dueDate={taskDueDate} taskDesc={taskDesc} />,
			<EditTask
				taskName={taskName}
				setTaskName={setTaskName}
				taskDesc={taskDesc}
				setTaskDesc={setTaskDesc}
				taskDueDate={taskDueDate}
				setTaskDueDate={setTaskDueDate}
			/>,
		]);

	const resetValue = () => {
		setTaskName("");
		setTaskDesc("");
		setTaskType("");
		setTaskId("");
		setTaskDueDate(new Date());
	};

	const handleViewTask = (
		title: string,
		description: string,
		dueDate: Date,
		type: string,
		id: string,
		status: TaskStatus,
	) => {
		setTaskName(title);
		setTaskDesc(description);
		setTaskDueDate(dueDate);
		setTaskType(type);
		setTaskId(id);
		setTaskStatus(status);
		openModal();
	};

	const handleDone = async () => {
		try {
			setIsLoading(true);
			if (!taskId || taskStatus !== "Pending")
				toast.error("Invalid task or status");
			const statusUpdated = await updateTaskStatus(taskId, "Completed");
			if (statusUpdated.success) {
				router.refresh();
				closeModal();
				resetValue();
				toast.success("Task marked as done");
			} else {
				toast.error("Error updating task status");
			}
		} catch {
			toast.error("Error updating task status");
		} finally {
			setIsLoading(false);
		}
	};

	const handleUnDone = async () => {
		try {
			setIsLoading(true);
			if (!taskId || taskStatus !== "Completed")
				toast.error("Invalid task or status");
			const statusUpdated = await updateTaskStatus(taskId, "Pending");
			if (statusUpdated.success) {
				router.refresh();
				closeModal();
				resetValue();
				toast.success("Task marked as pending");
			} else {
				toast.error("Error updating task status");
			}
		} catch {
			toast.error("Error updating task status");
		} finally {
			setIsLoading(false);
		}
	};

	const handleEdit = async () => {
		try {
			setIsLoading(true);
			if (!taskName || !taskDueDate) toast.error("Please fill all fields");
			const updatedTask = await updateTask(
				taskId,
				taskName,
				taskDueDate,
				taskDesc,
			);
			if (updatedTask.success) {
				router.refresh();
				closeModal();
				resetValue();
				toast.success("Task updated");
			} else {
				toast.error("Error updating task");
			}
		} catch {
			toast.error("Error updating task");
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			const deleted = await deleteTask(taskId);
			if (deleted.success) {
				router.refresh();
				toast.success("Task deleted");
				closeModal();
			} else {
				toast.error("Error deleting task");
			}
		} catch (error) {
			console.error("Error in handleDelete:", error);
			toast.error("Error deleting task");
		} finally {
			setIsDeleting(false);
		}
	};

	const mergedItems = [
		...(task
			? task.map(t => ({ ...t, type: "task", displayTitle: t.title, id: t.id }))
			: []),
		...(assignments?.map(a => ({
			...a,
			type: "assignment",
			displayTitle: a.name,
			id: a.id,
		})) ?? []),
	];

	if (mergedItems.length === 0) {
		return;
	}

	const filteredItems = mergedItems.filter(item => {
		if (!currentFilter || currentFilter === "all") return true;
		if (currentFilter === "assignments") return item.type === "assignment";
		if (currentFilter === "todos") return item.type === "task";
		return true;
	});

	const sortedItems = filteredItems.sort((a, b) => {
		const sortOrder = currentSort || "newest";
		if (sortOrder === "newest") {
			return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
		} else {
			return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
		}
	});

	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl2:grid-cols-4 xl3:grid-cols-5 gap-6">
				{sortedItems.map(item => (
					<div
						key={item.id}
						className="overflow-hidden border border-border rounded-lg p-5 flex flex-col relative"
					>
						<div className="flex justify-between items-center">
							<button
								className="text-primary font-medium transition-all duration-200 truncate"
								onClick={() =>
									handleViewTask(
										item.displayTitle,
										item.description as string,
										item.dueDate as Date,
										item.type,
										item.id,
										item.status as TaskStatus,
									)
								}
							>
								{item.displayTitle}
							</button>
							<button className="rounded-full text-muted hover:text-primary">
								<i className="ri-more-2-fill"></i>
							</button>
						</div>
						<div className="flex justify-between items-center">
							<p className="text-muted text-sm truncate">
								{item.description || "No Description"}
							</p>
						</div>
						<div className="flex items-center justify-between mt-3 text-sm text-gray-400">
							<span className="text-primary text-sm">
								<i className="ri-calendar-schedule-fill text-base"></i>{" "}
								{item.dueDate ? formatDueDate(item.dueDate) : "No due date"}
							</span>
							{item.type === "task" ? "Todo-Task" : "Assignment"}
						</div>
					</div>
				))}
			</div>
			{isOpen && currentPage === 1 && (
				<Modal extraClasses="max-w-[500px]">
					<div className="flex flex-col w-full">
						<div className="w-full justify-between items-center pt-6 px-6 h-full flex">
							<h3 className="flex gap-2 items-center text-xl font-medium">
								<i className="ri-todo-fill"></i>
								{taskName}
							</h3>
							<button
								onClick={() => {
									closeModal();
									resetValue();
								}}
								className="text-muted h-[24px] hover:text-primary duration-200"
							>
								<i className="ri-close-line ri-lg"></i>
							</button>
						</div>
						<div className="px-6 h-full overflow-y-auto">{page}</div>
						<div className="flex justify-between gap-3 mt-4 px-6 pb-6">
							{taskType === "task" ? (
								taskStatus !== "Completed" ? (
									<PrimaryButton
										text="Done"
										extraClasses="flex gap-1 items-center !mt-0 !w-fit"
										onClick={handleDone}
										type="button"
										icon="ri-check-fill"
										isLoading={isLoading}
										extraAttributes={{
											disabled: isLoading,
										}}
									/>
								) : (
									<PrimaryButton
										text="Undone"
										extraClasses="flex gap-1 items-center !mt-0 !w-fit"
										onClick={handleUnDone}
										type="button"
										icon="ri-check-fill"
										isLoading={isLoading}
										extraAttributes={{
											disabled: isLoading,
										}}
									/>
								)
							) : (
								<PrimaryButton
									text="View"
									extraClasses="flex gap-1 items-center !mt-0 !w-fit"
									onClick={() => {
										router.push(`/courses/assignments/${taskId}`);
									}}
									type="button"
									icon="ri-corner-up-right-line"
								/>
							)}
							<SecondaryButton
								text="Edit"
								extraClasses={`flex gap-1 items-center !mt-0 !w-fit ${taskType === "task" ? "" : "hidden"}`}
								onClick={() => {
									changePage(2);
								}}
								type="button"
								icon="ri-pencil-fill"
							/>
						</div>
					</div>
				</Modal>
			)}
			{isOpen && currentPage === 2 && (
				<Modal extraClasses="max-w-[500px]">
					<div className="flex flex-col w-full">
						<div className="w-full justify-between items-center p-6 h-full flex">
							<h3 className="flex gap-2 items-center text-xl font-medium">
								<i className="ri-pencil-fill"></i>
								Edit Task
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
								isLoading={isLoading}
								onClick={handleEdit}
								extraAttributes={{ disabled: isLoading }}
							/>
							<div className="flex gap-2 items-center">
								<PrimaryButton
									text="Delete"
									extraClasses="flex !w-fit !bg-[#b80404]"
									type="button"
									onClick={handleDelete}
									isLoading={isDeleting}
									extraAttributes={{
										disabled: isLoading || isDeleting,
									}}
								/>
								<SecondaryButton
									text="Cancel"
									onClick={() => {
										setTaskName("");
										setTaskDesc("");
										setTaskDueDate(new Date());
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
}
