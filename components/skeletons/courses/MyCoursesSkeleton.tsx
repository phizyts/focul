import CourseCardSkeleton from "./CourseCardSkeleton";

const MyCoursesSkeleton = () => {
	return (
		<>
			<div className="flex justify-between items-center mb-4 ">
				<h1 className="text-2xl font-medium flex items-center">My Courses</h1>
				<div className="xs:flex items-center gap-2 animate-pulse hidden">
					<div className="h-[35px] w-[85px] bg-gray-200 rounded-[8px]"></div>
					<div className="h-[35px] w-[99px] bg-gray-200 rounded-[8px]"></div>
					<div className="h-[35px] w-[134px] bg-gray-200 rounded-[8px]"></div>
				</div>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 xl2:grid-cols-4 gap-6">
				<CourseCardSkeleton />
				<CourseCardSkeleton />
				<CourseCardSkeleton />
				<CourseCardSkeleton />
				<CourseCardSkeleton />
				<CourseCardSkeleton />
			</div>
		</>
	);
};
export default MyCoursesSkeleton;
