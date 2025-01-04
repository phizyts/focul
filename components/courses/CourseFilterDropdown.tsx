import { courseTypes } from "@/constants/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { CourseFilterDropdownProps } from "@/types/course.types";

export const CourseFilterDropdown = ({
	isOpen,
	onClose,
}: CourseFilterDropdownProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const currentType = searchParams.get("type");

	const handleTypeSelect = (
		type: string | null,
		e: React.MouseEvent | React.TouchEvent,
	) => {
		e.preventDefault();
		e.stopPropagation();
		const params = new URLSearchParams(searchParams.toString());
		if (type) {
			params.set("type", type);
		} else {
			params.delete("type");
		}

		router.push(`?${params.toString()}`);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div
			className="absolute left-0 w-48 rounded-md shadow-lg bg-white border border-border z-50"
			onClick={e => e.stopPropagation()}
			onTouchEnd={e => e.stopPropagation()}
		>
			<div>
				<div className="px-4 py-3 border-b border-border text-sm font-medium text-muted">
					Filter by
				</div>
				<div
					onClick={e => handleTypeSelect(null, e)}
					onTouchEnd={e => handleTypeSelect(null, e)}
					className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
						!currentType ? "bg-[#F5F5F5]" : ""
					}`}
				>
					<span className={!currentType ? "text-primary" : "text-muted"}>
						All
					</span>
				</div>
				{courseTypes.map(type => (
					<div
						key={type.value}
						onClick={e => handleTypeSelect(type.value, e)}
						onTouchEnd={e => handleTypeSelect(type.value, e)}
						className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
							currentType === type.value ? "bg-[#F5F5F5]" : ""
						}`}
					>
						<span
							className={
								currentType === type.value ? "text-primary" : "text-muted"
							}
						>
							{type.display}
						</span>
					</div>
				))}
			</div>
		</div>
	);
};
