const SecondaryDropdownButton = ({
	icon,
	text,
	onClick,
	extraClasses,
	type = "button",
	disabled,
	dropDownOnClick,
}: {
	icon?: string | undefined;
	disabled?: boolean;
	text?: string;
	onClick?: () => void;
	extraClasses?: string;
	type?: "button" | "submit" | "reset" | undefined;
	dropDownOnClick?: () => void;
}) => {
	return (
		<>
			<button
				className={`h-[35px] flex py-2 px-3 rounded-l-[8px] duration-200 text-primary border hover:bg-[#F5F5F5] border-border text-sm mt-2 ${extraClasses}`}
				type={type}
				onClick={onClick}
				disabled={disabled}
			>
				{icon !== "" && <i className={`${icon}`}></i>}
				{text && text}
			</button>
			<button
				className="px-0.5 py-1.5 h-[35px] text-sm font-medium border-t border-b border-r border-border text-primary hover:bg-[#F5F5F5] rounded-r-[8px]"
				onClick={dropDownOnClick}
			>
				<i className="ri-arrow-drop-down-line"></i>
			</button>
		</>
	);
};
export default SecondaryDropdownButton;
