import InfoCardSkeleton from "../../InfoCardSkeleton";

const CourseDetailSkeleton = () => {
	return (
		<div className="w-full">
			<div className="flex justify-between items-center mb-4">
				<div className="flex items-center gap-2">
					<div className="h-[35px] bg-gray-200 rounded w-[35px]"></div>
					<div className="h-[35px] bg-gray-200 rounded w-[120px]"></div>
				</div>
				<div className="flex items-center gap-2">
					<div className="h-[35px] bg-gray-200 rounded w-[90px]"></div>
					<div className="h-[35px] bg-gray-200 rounded w-[80px]"></div>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl2:grid-cols-4 gap-6">
				<InfoCardSkeleton />
				<InfoCardSkeleton />
				<InfoCardSkeleton />
				<InfoCardSkeleton />
			</div>
			<div className="grid xl2:grid-cols-5 xl3:grid-cols-3 gap-6 animate-pulse">
				<div className="border border-border rounded-[10px] mt-6 w-full xl3:col-span-2 xl2:col-span-3 overflow-x-auto">
					<div className="flex items-center mb-4 gap-2 px-5 pt-5">
						<div className="h-6 bg-gray-200 rounded w-6"></div>
						<div className="h-4 bg-gray-200 rounded w-1/4"></div>
					</div>
					<table className="w-full min-w-[650px]">
						<thead className="border-t border-border w-full">
							<tr className="text-left text-muted">
								<th className="py-2 font-normal">
									<div className="h-4 bg-gray-200 rounded w-1/4"></div>
								</th>
								<th className="py-2 font-normal">
									<div className="h-4 bg-gray-200 rounded w-1/4"></div>
								</th>
								<th className="py-2 font-normal">
									<div className="h-4 bg-gray-200 rounded w-1/4"></div>
								</th>
								<th className="py-2 font-normal">
									<div className="h-4 bg-gray-200 rounded w-1/4"></div>
								</th>
								<th className="py-2 font-normal">
									<div className="h-4 bg-gray-200 rounded w-1/4"></div>
								</th>
							</tr>
						</thead>
						<tbody></tbody>
					</table>
				</div>
				<div className="border border-border rounded-[10px] xl2:mt-6 w-full xl2:col-span-2 xl3:col-span-1">
					<div className="flex items-center mb-4 gap-2 px-5 pt-5">
						<div className="h-6 bg-gray-200 rounded w-6"></div>
						<div className="h-4 bg-gray-200 rounded w-1/4"></div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default CourseDetailSkeleton;
