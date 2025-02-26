"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TaskNavigation({ className = "" }) {
	const pathname = usePathname();

	return (
		<ul className={`flex items-center gap-5 text-muted ${className}`}>
			{[
				{ path: "/tasks/upcoming", label: "Upcoming" },
				{ path: "/tasks/finished", label: "Finished" },
				{ path: "/tasks/overdue", label: "Overdue" },
			].map(({ path, label }) => {
				const isActive = pathname.startsWith(path);

				return (
					<li key={label}>
						<Link
							href={path}
							className={`relative ${isActive ? "pageActive" : "pageHoverActive"}`}
						>
							{label}
						</Link>
					</li>
				);
			})}
		</ul>
	);
}
