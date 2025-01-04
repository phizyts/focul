import { Loading } from "../Loading";

const PrimaryButton = ({
	text,
	onClick,
	extraClasses,
	extraAttributes,
	type = "button",
	isLoading,
	icon,
}: {
	text: string;
	onClick?: () => void;
	extraClasses?: string;
	extraAttributes?: { [key: string]: any };
	type?: "button" | "submit" | "reset";
	isLoading?: boolean;
	icon?: string;
}) => {
	return (
		<button
			className={`w-full flex justify-center items-center h-[35px] py-2 px-4 rounded-[8px] bg-primary duration-200 text-white text-sm mt-2 ${extraClasses}`}
			type={type}
			onClick={onClick}
			{...extraAttributes}
		>
			{isLoading ? <Loading isWhite /> : icon && <i className={icon}></i>}
			{!isLoading && text}
		</button>
	);
};

export default PrimaryButton;
