"use client";
import React, { useState } from "react";

const FilterButtons: React.FC = () => {
	const [filter, setFilter] = useState<"all" | "unread">("all");

	return (
		<div className="flex flex-col sm:flex-row sm:justify-end items-center gap-3 sm:gap-4 mt-4 sm:mt-0 w-full">
			<button
				onClick={() => setFilter(filter === "all" ? "unread" : "all")}
				className="flex items-center justify-center px-4 py-3 sm:py-2 rounded-lg border border-border hover:bg-[#1F2324] text-muted text-sm sm:text-base w-full sm:w-auto"
			>
				<i className={`ri-filter-${filter === "all" ? "3" : "2"}-fill`}></i>
				<span className="ml-2">
					{filter === "all" ? "Show Unread" : "Show All"}
				</span>
			</button>
			<button className="flex items-center justify-center px-4 py-3 sm:py-2 rounded-lg border border-border hover:bg-[#1F2324] text-muted text-sm sm:text-base w-full sm:w-auto">
				<i className="ri-check-double-fill"></i>
				<span className="ml-2">Mark All Read</span>
			</button>
		</div>
	);
};

export default FilterButtons;
