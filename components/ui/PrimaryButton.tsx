import { Loading } from "./Loading";

const PrimaryButton = ({
	text,
	onClick,
	extraClasses,
	extrattributes,
	type = "button",
	isLoading,
}: {
	text: string;
	onClick?: () => void;
	extraClasses?: string;
	extrattributes?: { [key: string]: any };
	type?: "button" | "submit" | "reset" | undefined;
	isLoading?: boolean;
}) => {
	return (
		<button
			className={`w-full h-[35px] py-2 px-4 rounded-[8px] bg-primary duration-200 text-white text-sm mt-2 ${extraClasses}`}
			type={type}
			onClick={onClick}
			{...extrattributes}
		>
			{isLoading ? <Loading isWhite /> : text}
		</button>
	);
};
export default PrimaryButton;
