import { getCourses } from "@/action/course.action";
import { getUser } from "@/action/user.action";
import CourseCard from "@/components/ui/cards/CourseCard";
import { User } from "@prisma/client";
import "remixicon/fonts/remixicon.css";

export default async function MyCourses() {
	const user = await getUser();
	const courses = await getCourses(user as User);

	return (
		<>
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-medium">My Courses</h1>
				<button className="flex items-center gap-1 text-[15px] font-medium bg-primary text-white px-4 py-2 rounded-[5px]">
					<i className="ri-add-line ri-lg"></i>
					New Course
				</button>
			</div>
			{courses ? (
				<CourseCard courses={courses} />
			) : (
				<div className="flex flex-col items-center justify-center p-12 text-center rounded-lg border border-border">
					<div className="w-16 h-16 bg-[#1F2324] rounded-full flex items-center justify-center mb-4">
						<i className="ri-notification-off-fill ri-2x text-muted"></i>
					</div>
					<h3 className="text-lg font-medium mb-2">No courses found</h3>
					<p className="text-muted max-w-sm">
						You have no courses yet. Create a new course to get started.
					</p>
				</div>
			)}
		</>
	);
}
