export interface NavRoute {
	name: string;
	href: string;
	icon: string;
	soon?: boolean;
}

export interface NavCategory {
	name?: string;
	routes: NavRoute[];
}

export interface LanguageOption {
	display: string;
	value: string;
}

export interface CourseTypeOption {
	display: string;
	value: "Regular" | "AP" | "IB" | "Honors";
}
