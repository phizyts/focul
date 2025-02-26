"use client";
import { useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TaskFilterDropdown } from "./TaskFilterDropdown";

export default function TaskFilters({ className = "" }) {
	const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
	const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
	const filterRef = useRef<HTMLDivElement>(null);
	const sortRef = useRef<HTMLDivElement>(null);
	const searchParams = useSearchParams();
	const router = useRouter();
	const currentFilter = searchParams.get("filter");
	const currentSort = searchParams.get("sort") || "newest";

	const handleSortChange = (sort: string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("sort", sort);
		router.push(`?${params.toString()}`);
		setSortDropdownOpen(false);
	};

	const getDisplayFilter = () => {
		switch (currentFilter) {
			case "assignments":
				return "Assignments";
			case "todos":
				return "Todo Tasks";
			default:
				return "All";
		}
	};

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
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
		<div
			className={`xs:flex hidden justify-between items-center gap-4 ${className}`}
		>
			<div ref={sortRef} className="relative">
				<button onClick={() => setSortDropdownOpen(!sortDropdownOpen)}>
					<h2 className="text-muted">
						Sort by{" "}
						<span className="text-primary">
							{currentSort === "newest" ? "Newest" : "Oldest"}
						</span>
					</h2>
				</button>
				{sortDropdownOpen && (
					<div className="absolute left-0 w-48 rounded-md shadow-lg bg-white border border-border z-50">
						<div className="">
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
			<div ref={filterRef} className="relative">
				<button onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}>
					<h2 className="text-muted">
						Filter by <span className="text-primary">{getDisplayFilter()}</span>
					</h2>
				</button>
				<TaskFilterDropdown
					isOpen={filterDropdownOpen}
					onClose={() => setFilterDropdownOpen(false)}
				/>
			</div>
		</div>
	);
}
