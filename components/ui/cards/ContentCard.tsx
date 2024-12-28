const ContentCard = ({
	title,
	content,
	icon,
}: {
	title: string;
	content: string;
	icon?: string;
}) => {
	return (
		<div className="group flex flex-col border-border border w-full p-5 gap-4 rounded-[10px]">
			<div className="flex justify-between items-center">
				<div className="flex items-center gap-2 text-primary text-xl font-medium">
					{icon && <i className={`${icon} text-lg`}></i>}
					<h2>{title}</h2>
				</div>
			</div>
			<h1 className="text-muted">{content}</h1>
		</div>
	);
};
export default ContentCard;
