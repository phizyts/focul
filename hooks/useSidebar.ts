import { useState } from "react";

export function useSidebar() {
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const [sidebarHidden, setSidebarHidden] = useState(false);

	const toggleSidebar = (value: boolean) => setSidebarCollapsed(value);
	const toggleHidden = (value: boolean) => setSidebarHidden(value);

	return { sidebarCollapsed, toggleSidebar, sidebarHidden, toggleHidden };
}
