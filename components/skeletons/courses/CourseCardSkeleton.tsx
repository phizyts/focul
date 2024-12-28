const CourseCardSkeleton = () => {
	return (
		<div className="overflow-hidden border border-border rounded-lg p-5 flex flex-col gap-3 relative cursor-pointer duration-200 animate-pulse">
			<div className="flex justify-between items-center">
				<div className="flex items-center gap-2">
					<div className="bg-gray-200 h-6 w-6 rounded"></div>
					<div className="bg-gray-200 h-4 w-10 rounded"></div>
				</div>
				<div className="rounded-full bg-gray-200 h-6 w-6"></div>
			</div>
			<div className="bg-gray-200 h-12 w-1/2 rounded"></div>
			<div className="flex justify-between items-center">
				<div className="text-muted text-sm">
					<div className="bg-gray-200 h-4 w-16 rounded"></div>
				</div>
				<div className="text-muted text-sm">
					<div className="bg-gray-200 h-4 w-16 rounded"></div>
				</div>
			</div>
		</div>
	);
};
export default CourseCardSkeleton;
