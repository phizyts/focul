import { getAllCourses } from "@/action/course.action";
import { getAllGradingPolicy, getUser } from "@/action/user.action";
import CourseCard from "@/components/ui/cards/CourseCard";
import CourseActions from "@/components/courses/CourseActions";
import { AssignmentType, GradingPolicy, User } from "@prisma/client";
import "remixicon/fonts/remixicon.css";
export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const params = await searchParams;
	const type = params?.type as string | undefined;
	const user = await getUser();
	const courses = await getAllCourses(user as User, type);
	const gradingPoliciesWithAGPId = await getAllGradingPolicy(
		user?.id as string,
		true,
	);

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
						gradingPoliciesWithAGPId as {
							gradingPolicy: (GradingPolicy & {
								assignmentTypes: AssignmentType[];
							})[];
							agpId: string;
						}
					}
				/>
			</div>
			{courses.length > 0 ? (
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
