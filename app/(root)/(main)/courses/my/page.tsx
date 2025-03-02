import { getAllCourses } from "@/action/course.action";
import { getAllGradingPolicy, getUser } from "@/action/user.action";
import CourseCard from "@/components/ui/cards/CourseCard";
import CourseActions from "@/components/courses/CourseActions";
import "remixicon/fonts/remixicon.css";
import { GradingPoliciesWithAGPId } from "@/types/course.types";
export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const params = await searchParams;
	const type = params?.type as string | undefined;
	const { data: user } = await getUser();
	const { data: courses } = await getAllCourses(type);
	const { data: gradingPoliciesWithAGPId } = await getAllGradingPolicy(true);

	return (
		<>
			<div className="flex justify-between items-center mb-4 ">
				<h1 className="text-2xl font-medium flex items-center">
					My Courses
					{type && (
						<span className="text-muted text-lg ml-2 font-normal">
							• {type}
						</span>
					)}
				</h1>
				<CourseActions
					gradingPoliciesWithAGPId={
						gradingPoliciesWithAGPId as GradingPoliciesWithAGPId
					}
				/>
			</div>
			{courses && courses.length > 0 ? (
				<CourseCard courses={courses} />
			) : (
				<div className="flex flex-col items-center justify-center mt-12 text-center rounded-lg">
					<p className="text-muted text-sm">
						{type
							? `No ${type} courses found.`
							: "You have no courses yet. Create a new course to get started."}
					</p>
				</div>
			)}
		</>
	);
}
