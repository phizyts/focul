interface FilterButtonProps {
	text: string;
	isOpen: boolean;
	onClick: () => void;
}

const FilterButton = ({ text, isOpen, onClick }: FilterButtonProps) => {
	return (
		<button
			onClick={onClick}
			className="h-[35px] flex items-center gap-2 py-2 px-4 rounded-[8px] duration-200 text-primary border hover:bg-[#F5F5F5] border-border text-sm"
		>
			<i className="ri-filter-2-line" />
			<span>{text}</span>
			<i
				className={`ri-arrow-down-s-line transition-transform duration-200 ${
					isOpen ? "rotate-180" : ""
				}`}
			/>
		</button>
	);
};

export default FilterButton;
