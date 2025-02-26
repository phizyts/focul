"use client";
import { useRef, useState } from "react";
import SecondaryButton from "../ui/buttons/SecondaryButton";
import { useModal } from "@/hooks/useModal";
import CreateTask from "./CreateTask";
import Modal from "../Modal";
import PrimaryButton from "../ui/buttons/PrimaryButton";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createTask } from "@/action/task.action";
import { authClient } from "@/lib/auth-client";

export default function TaskActions({ className = "" }) {
	const router = useRouter();
	const [isLoading, setIsloading] = useState(false);
	const { data: session } = authClient.useSession();
	const userId = session?.user.id;
	const [taskName, setTaskName] = useState("");
	const [taskDesc, setTaskDesc] = useState("");
	const [taskDueDate, setTaskDueDate] = useState(new Date());
	const { isOpen, openModal, closeModal, page, currentPage, changePage } =
		useModal([
			<CreateTask
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
		setTaskDueDate(new Date());
	};

	const handleCreateTask = async () => {
		setIsloading(true);
		try {
			if (!userId) return;
			if (!taskName || !taskDueDate) {
				toast.error("Please fill all fields");
				return;
			}
			const createdTask = await createTask(
				taskName,
				taskDueDate,
				userId as string,
				taskDesc,
			);
			if (createdTask) {
				resetValue();
				closeModal();
				router.refresh();
				toast.success("Task created");
			}
		} catch (error) {
			console.error("Error creating task:", error);
		} finally {
			setIsloading(false);
		}
	};
	return (
		<div className={`xs:flex items-center gap-2 hidden ${className}`}>
			<div className="relative">
				<SecondaryButton
					text="New Task"
					icon="ri-add-line"
					extraClasses="flex gap-1 items-center !mt-0"
					onClick={() => {
						changePage(1);
						openModal();
					}}
				/>
				<div className="absolute left-0"></div>
			</div>
			{isOpen && currentPage === 1 && (
				<Modal extraClasses="max-w-[500px]">
					<div className="flex flex-col w-full">
						<div className="w-full justify-between items-center p-6 h-full flex">
							<h3 className="flex gap-2 items-center text-xl font-medium">
								<i className="ri-pencil-fill"></i>
								Create Task
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
								isLoading={isLoading}
								onClick={handleCreateTask}
								extraAttributes={{ disabled: isLoading }}
							/>
							<SecondaryButton
								text="Cancel"
								onClick={() => {
									resetValue();
									closeModal();
								}}
								type="button"
							/>
						</div>
					</div>
				</Modal>
			)}
		</div>
	);
}
