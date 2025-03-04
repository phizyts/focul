import {
	NavCategory,
	LanguageOption,
	CourseTypeOption,
} from "@/types/constants.types";

export const sidebarRoutes: NavCategory[] = [
	{
		routes: [
			{
				name: "Dashboard",
				href: "/dashboard",
				icon: "ri-layout-fill",
			},
			{
				name: "Community",
				href: "/community",
				icon: "ri-group-fill",
				soon: true,
			},
			{
				name: "Calendar",
				href: "/calendar",
				icon: "ri-calendar-fill",
				soon: true,
			},
			{
				name: "Tasks",
				href: "/tasks",
				icon: "ri-todo-fill",
			},
			{
				name: "Inbox",
				href: "/inbox",
				icon: "ri-inbox-2-fill",
				soon: true,
			},
		],
	},
	{
		name: "COURSES",
		routes: [
			{
				name: "Courses",
				href: "/courses/my",
				icon: "ri-graduation-cap-fill",
			},
			{
				name: "Assignments",
				href: "/courses/assignments",
				icon: "ri-book-open-fill",
			},
		],
	},
	{
		name: "STUDY TOOLS",
		routes: [
			{
				name: "Notes",
				href: "/tools/notes",
				icon: "ri-booklet-fill",
				soon: true,
			},
			{
				name: "Flashcards",
				href: "/tools/flashcards",
				icon: "ri-sticky-note-2-fill",
				soon: true,
			},
			{
				name: "Promodoro",
				href: "/tools/promodoro",
				icon: "ri-timer-fill",
				soon: true,
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
				href: "/inbox",
				icon: "ri-inbox-2-fill",
			},
			{
				name: "Settings",
				href: "/settings",
				icon: "ri-settings-4-fill",
			},
		],
	},
];

export const languages: LanguageOption[] = [
	{
		display: "English",
		value: "English",
	},
	{
		display: "Español",
		value: "Spanish",
	},
	{
		display: "中文",
		value: "Chinese",
	},
	{
		display: "Français",
		value: "French",
	},
];

export const courseTypes: CourseTypeOption[] = [
	{
		display: "Regular Course",
		value: "Regular",
	},
	{
		display: "AP Course",
		value: "AP",
	},
	{
		display: "IB Course",
		value: "IB",
	},
	{
		display: "Honors Course",
		value: "Honors",
	},
];
