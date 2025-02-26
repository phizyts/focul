"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import TaskMobileFilterDropdown from "./TaskMobileFilterDropdown";
import { useModal } from "@/hooks/useModal";
import CreateTask from "./CreateTask";
import Modal from "../Modal";
import PrimaryButton from "../ui/buttons/PrimaryButton";
import SecondaryButton from "../ui/buttons/SecondaryButton";
import { createTask } from "@/action/task.action";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function TaskMobileDropdown() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const currentPath = usePathname();
	const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
	const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const filterRef = useRef<HTMLDivElement>(null);
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

	const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
	const sortRef = useRef<HTMLDivElement>(null);
	const currentSort = searchParams.get("sort") || "newest";

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

	const handleSelect = (
		path: string,
		e: React.MouseEvent | React.TouchEvent,
	) => {
		e.preventDefault();
		e.stopPropagation();
		router.push(path);
		setDropdownIsOpen(false);
	};

	const handleSortChange = (sort: string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("sort", sort);
		router.push(`?${params.toString()}`);
		setSortDropdownOpen(false);
		setDropdownIsOpen(false);
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
			if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
				setSortDropdownOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="relative xs:hidden" ref={dropdownRef}>
			<i
				onClick={() => setDropdownIsOpen(!dropdownIsOpen)}
				className="ri-menu-line text-muted duration-200 hover:bg-[#F5F5F5] cursor-pointer rounded-[8px] border border-border p-2"
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
								setSortDropdownOpen(!sortDropdownOpen);
							}}
						>
							<i className="ri-sort-desc mr-2" />
							Sort
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
							New Task
						</button>
						<div className="border-t border-border my-1"></div>
						<div
							onClick={e => handleSelect("/tasks/upcoming", e)}
							className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
								currentPath === "/tasks/upcoming" ? "bg-[#F5F5F5]" : ""
							}`}
						>
							<span
								className={
									currentPath === "/tasks/upcoming"
										? "text-primary"
										: "text-muted"
								}
							>
								Upcoming
							</span>
						</div>
						<div
							onClick={e => handleSelect("/tasks/finished", e)}
							className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
								currentPath === "/tasks/finished" ? "bg-[#F5F5F5]" : ""
							}`}
						>
							<span
								className={
									currentPath === "/tasks/finished"
										? "text-primary"
										: "text-muted"
								}
							>
								Finished
							</span>
						</div>
					</div>
				</div>
			)}
			<div className="absolute right-0 mt-2" ref={filterRef}>
				<TaskMobileFilterDropdown
					isOpen={filterDropdownOpen}
					onClose={() => setFilterDropdownOpen(false)}
				/>
			</div>
			<div className="absolute right-0 mt-2" ref={sortRef}>
				{sortDropdownOpen && (
					<div className="absolute right-0 w-48 rounded-md shadow-lg bg-white border border-border z-50">
						<div>
							<div className="px-4 py-3 border-b border-border text-sm font-medium text-muted">
								Sort by
							</div>
							<div
								className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
									currentSort === "newest" ? "bg-[#F5F5F5]" : ""
								}`}
								onClick={() => handleSortChange("newest")}
							>
								<span
									className={
										currentSort === "newest" ? "text-primary" : "text-muted"
									}
								>
									Newest
								</span>
							</div>
							<div
								className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
									currentSort === "oldest" ? "bg-[#F5F5F5]" : ""
								}`}
								onClick={() => handleSortChange("oldest")}
							>
								<span
									className={
										currentSort === "oldest" ? "text-primary" : "text-muted"
									}
								>
									Oldest
								</span>
							</div>
						</div>
					</div>
				)}
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
