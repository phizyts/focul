const InfoCardSkeleton = () => {
	return (
		<div className="overflow-hidden border border-border rounded-lg h-32 p-5 flex flex-col gap-3 relative cursor-pointer duration-200 animate-pulse">
			<div className="flex justify-between items-center">
				<div className="flex items-center gap-2">
					<div className="bg-gray-200 h-6 w-5 rounded"></div>
					<div className="bg-gray-200 h-6 w-20 rounded"></div>
				</div>
				<div className="rounded-full bg-gray-200 h-6 w-6"></div>
			</div>
			<div className="bg-gray-200 h-12 w-[50px] rounded"></div>
		</div>
	);
};
export default InfoCardSkeleton;
