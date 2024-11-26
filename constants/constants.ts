interface NavRoute {
	name: string;
	href: string;
	icon: string;
}

interface NavCategory {
	name: string;
	routes: NavRoute[];
}

export const sidebarRoutes: NavCategory[] = [
	{
		name: "Dashboard",
		routes: [
			{
				name: "Overview",
				href: "/dashboard/overview",
				icon: "ri-layout-grid-fill",
			},
			{
				name: "Calendar",
				href: "/dashboard/calendar",
				icon: "ri-calendar-fill",
			},
			{
				name: "Reminder",
				href: "/dashboard/reminder",
				icon: "ri-file-list-fill",
			},
		],
	},
	{
		name: "Courses",
		routes: [
			{
				name: "My Courses",
				href: "/dashboard/courses/my",
				icon: "ri-book-fill",
			},
			{
				name: "Assignments",
				href: "/dashboard/courses/assignments",
				icon: "ri-book-open-fill",
			},
			{
				name: "Grades",
				href: "/dashboard/courses/grades",
				icon: "ri-numbers-fill",
			},
		],
	},
	{
		name: "Study Tools",
		routes: [
			{
				name: "Notes",
				href: "/dashboard/tools/notes",
				icon: "ri-sticky-note-add-fill",
			},
			{
				name: "Flashcards",
				href: "/dashboard/tools/flashcards",
				icon: "ri-sticky-note-2-fill",
			},
		],
	},
	{
		name: "Community",
		routes: [
			{
				name: "Friends",
				href: "/dashboard/community/friends",
				icon: "ri-group-fill",
			},
			{
				name: "Study Groups",
				href: "/dashboard/community/groups",
				icon: "ri-team-fill",
			},
		],
	},
];

export const bottomRoutes: NavCategory[] = [
	{
		name: "Others",
		routes: [
			{
				name: "Inbox",
				href: "/dashboard/inbox",
				icon: "ri-inbox-2-fill",
			},
			{
				name: "Settings",
				href: "/dashboard/account/settings",
				icon: "ri-settings-4-fill",
			},
		],
	},
];
