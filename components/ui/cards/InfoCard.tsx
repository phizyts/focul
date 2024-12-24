const InfoCard = ({
	title,
	value,
	icon,
}: {
	title: string;
	value: string;
	icon: string;
}) => {
	return (
		<div className="flex flex-col border-border border w-full p-5 gap-4 rounded-[10px]">
			<div className="flex justify-between items-center">
				<div className="flex items-center gap-2 text-muted">
					<i className={`${icon} text-lg`}></i>
					<h2>{title}</h2>
				</div>
				<button className="rounded-full text-muted hover:text-primary">
					<i className="ri-more-2-fill text-lg"></i>
				</button>
			</div>
			<h1 className="text-4xl font-medium text-primary">{value}</h1>
		</div>
	);
};
export default InfoCard;
