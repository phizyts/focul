export const AssignmentsSkeleton = () => {
	return (
		<div className="w-full">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-medium flex items-center gap-2">
					All Assignments
				</h1>

				<div className="flex gap-4">
					<div className="xs:flex items-center gap-2 hidden">
						<div className="h-[35px] w-32 bg-gray-200 animate-pulse rounded-lg"></div>
						<div className="h-[35px] w-32 bg-gray-200 animate-pulse rounded-lg"></div>
					</div>
					<div className="xs:hidden">
						<div className="h-[35px] w-[35px] bg-gray-200 animate-pulse rounded-lg"></div>
					</div>
				</div>
			</div>

			<div className="border border-border rounded-[10px] w-full overflow-x-auto">
				<table className="w-full min-w-[650px]">
					<thead className="border-b border-border w-full">
						<tr className="text-left">
							<th className="py-3 pl-5">
								<div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
							</th>
							<th className="py-3">
								<div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
							</th>
							<th className="py-3">
								<div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
							</th>
							<th className="py-3">
								<div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
							</th>
							<th className="py-3">
								<div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
							</th>
						</tr>
					</thead>
					<tbody>
						{[...Array(4)].map((_, index) => (
							<tr key={index}>
								<td className="py-3 pl-5">
									<div className="h-4 w-28 bg-gray-200 animate-pulse rounded"></div>
								</td>
								<td className="py-3">
									<div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
								</td>
								<td className="py-3">
									<div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
								</td>
								<td className="py-3">
									<div className="h-4 w-28 bg-gray-200 animate-pulse rounded"></div>
								</td>
								<td className="py-3">
									<div className="h-6 w-20 bg-gray-200 animate-pulse rounded-full"></div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};
