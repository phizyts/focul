"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface TaskMobileFilterDropdownProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function TaskMobileFilterDropdown({
	isOpen,
	onClose,
}: TaskMobileFilterDropdownProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const currentFilter = searchParams.get("filter");

	const handleFilterSelect = (filter: string | null) => {
		const params = new URLSearchParams(searchParams.toString());
		if (filter) {
			params.set("filter", filter);
		} else {
			params.delete("filter");
		}
		router.push(`?${params.toString()}`);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className="absolute right-0 w-48 rounded-md shadow-lg bg-white border border-border z-50">
			<div>
				<div className="px-4 py-3 border-b border-border text-sm font-medium text-muted">
					Filter by
				</div>
				<div
					onClick={() => handleFilterSelect(null)}
					className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
						!currentFilter ? "bg-[#F5F5F5]" : ""
					}`}
				>
					<span className={!currentFilter ? "text-primary" : "text-muted"}>
						All
					</span>
				</div>
				<div
					onClick={() => handleFilterSelect("assignments")}
					className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
						currentFilter === "assignments" ? "bg-[#F5F5F5]" : ""
					}`}
				>
					<span
						className={
							currentFilter === "assignments" ? "text-primary" : "text-muted"
						}
					>
						Assignments
					</span>
				</div>
				<div
					onClick={() => handleFilterSelect("todos")}
					className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
						currentFilter === "todos" ? "bg-[#F5F5F5]" : ""
					}`}
				>
					<span
						className={
							currentFilter === "todos" ? "text-primary" : "text-muted"
						}
					>
						Todo Tasks
					</span>
				</div>
			</div>
		</div>
	);
}
