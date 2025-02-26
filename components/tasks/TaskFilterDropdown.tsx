import { useRouter, useSearchParams } from "next/navigation";

interface TaskFilterDropdownProps {
	isOpen: boolean;
	onClose: () => void;
}

export const TaskFilterDropdown = ({
	isOpen,
	onClose,
}: TaskFilterDropdownProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const currentFilter = searchParams.get("filter");

	const filterOptions = [
		{ value: "all", display: "All" },
		{ value: "assignments", display: "Assignments" },
		{ value: "todos", display: "Todo Tasks" },
	];

	const handleFilterSelect = (
		filter: string | null,
		e: React.MouseEvent | React.TouchEvent,
	) => {
		e.preventDefault();
		e.stopPropagation();
		const params = new URLSearchParams(searchParams.toString());

		if (filter && filter !== "all") {
			params.set("filter", filter);
		} else {
			params.delete("filter");
		}

		router.push(`?${params.toString()}`);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div
			className="absolute right-0 w-48 rounded-md shadow-lg bg-white border border-border z-50"
			onClick={e => e.stopPropagation()}
			onTouchEnd={e => e.stopPropagation()}
		>
			<div>
				<div className="px-4 py-3 border-b border-border text-sm font-medium text-muted">
					Filter by
				</div>
				{filterOptions.map(option => (
					<div
						key={option.value}
						onClick={e => handleFilterSelect(option.value, e)}
						onTouchEnd={e => handleFilterSelect(option.value, e)}
						className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
							currentFilter === option.value ||
							(!currentFilter && option.value === "all")
								? "bg-[#F5F5F5]"
								: ""
						}`}
					>
						<span
							className={
								currentFilter === option.value ||
								(!currentFilter && option.value === "all")
									? "text-primary"
									: "text-muted"
							}
						>
							{option.display}
						</span>
					</div>
				))}
			</div>
		</div>
	);
};
