const PrimaryButton = ({
	text,
	onClick,
	extraClasses,
	type = "button",
}: {
	text: string;
	onClick?: () => void;
	extraClasses?: string;
	type?: "button" | "submit" | "reset" | undefined;
}) => {
	return (
		<button
			className={`w-full h-[35px] py-2 px-4 rounded-[8px] bg-primary duration-200 text-white text-sm mt-2 ${extraClasses}`}
			type={type}
			onClick={onClick}
		>
			{text}
		</button>
	);
};
export default PrimaryButton;
