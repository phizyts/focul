const SecondaryButton = ({
	icon,
	text,
	onClick,
	extraClasses,
	type = "button",
	disabled,
}: {
	icon?: string | undefined;
	disabled?: boolean;
	text?: string;
	onClick?: () => void;
	extraClasses?: string;
	type?: "button" | "submit" | "reset" | undefined;
}) => {
	return (
		<button
			className={`h-[35px] flex py-2 px-4 rounded-[8px] duration-200 text-primary border hover:bg-[#F5F5F5] border-border text-sm mt-2 ${extraClasses}`}
			type={type}
			onClick={onClick}
			disabled={disabled}
		>
			{icon !== "" && <i className={`${icon}`}></i>}
			{text && text}
		</button>
	);
};
export default SecondaryButton;
