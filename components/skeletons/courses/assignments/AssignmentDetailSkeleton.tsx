const AssignmentDetailSkeleton = () => {
	return (
		<div className="w-full">
			<div className="flex justify-between items-center mb-4">
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 rounded-md bg-gray-200 animate-pulse" />
					<div className="w-48 h-8 rounded-md bg-gray-200 animate-pulse" />
				</div>
				<div className="w-24 h-10 rounded-md bg-gray-200 animate-pulse" />
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl2:grid-cols-4 gap-6 mb-6">
				{[...Array(4)].map((_, index) => (
					<div
						key={index}
						className="p-6 rounded-lg bg-white border border-gray-100"
					>
						<div className="flex items-center justify-between mb-4">
							<div className="w-20 h-6 bg-gray-200 rounded animate-pulse" />
							<div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
						</div>
						<div className="w-32 h-8 bg-gray-200 rounded animate-pulse" />
					</div>
				))}
			</div>
			<div className="p-6 rounded-lg bg-white border border-gray-100">
				<div className="mb-4 w-48 h-6 bg-gray-200 rounded animate-pulse" />
				<div className="space-y-3">
					<div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
					<div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
					<div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
				</div>
			</div>
		</div>
	);
};

export default AssignmentDetailSkeleton;
