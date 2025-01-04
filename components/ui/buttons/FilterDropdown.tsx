export const FilterDropdown = ({
	isOpen,
	onClose,
	options,
	currentValue,
	onSelect,
	title,
}: {
	isOpen: boolean;
	onClose: () => void;
	options: { id: string; name: string }[];
	currentValue: string | null;
	onSelect: (value: string | null) => void;
	title: string;
}) => {
	return (
		<div
			className={`absolute xs:right-0 w-48 rounded-md shadow-lg bg-white border border-border z-50 transition-all duration-200 ${
				isOpen
					? "opacity-100 visible translate-y-0"
					: "opacity-0 invisible -translate-y-2"
			}`}
			onClick={e => e.stopPropagation()}
		>
			<div>
				<div className="px-4 py-3 border-b border-border text-sm font-medium text-muted">
					{title}
				</div>
				<div
					onClick={() => {
						onSelect(null);
						onClose();
					}}
					className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
						!currentValue ? "bg-[#F5F5F5]" : ""
					}`}
				>
					<span className={!currentValue ? "text-primary" : "text-muted"}>
						All
					</span>
				</div>
				{options.map(option => (
					<div
						key={option.id}
						onClick={() => {
							onSelect(option.id);
							onClose();
						}}
						className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
							currentValue === option.id ? "bg-[#F5F5F5]" : ""
						}`}
					>
						<span
							className={
								currentValue === option.id ? "text-primary" : "text-muted"
							}
						>
							{option.name}
						</span>
					</div>
				))}
			</div>
		</div>
	);
};
