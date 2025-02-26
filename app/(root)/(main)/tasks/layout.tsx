import TaskActions from "@/components/tasks/TaskActions";
import TaskFilters from "@/components/tasks/TaskFilters";
import TaskNavigation from "@/components/tasks/TaskNavigation";
import TaskMobileDropdown from "@/components/tasks/TaskMobileDropdown";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<div className="flex flex-col justify-between mb-6 border-b border-border -mx-4 xss:-mx-5 sm:-mx-7 px-4 xss:px-5 sm:px-7">
				<div className="flex justify-between items-center pb-6 h-[59px]">
					<h1 className="text-2xl font-medium flex items-center">My Tasks</h1>
					<div className="flex items-center gap-2">
						<TaskActions className="hidden xs:block" />
						<TaskMobileDropdown />
					</div>
				</div>
				<div className="flex items-center justify-between pb-2">
					<TaskNavigation />
					<TaskFilters />
				</div>
			</div>
			{children}
		</>
	);
}
