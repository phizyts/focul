"use client";
import Navbar from "@/components/navbar/Navbar";
import Sidebar from "@/components/sidebar/Sidebar";
import { useSidebar } from "@/hooks/useSidebar";
import { authClient } from "@/lib/auth-client";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
	const { data: session, isPending } = authClient.useSession();
	const { sidebarCollapsed, toggleSidebar, sidebarHidden, toggleHidden } =
		useSidebar();

	useEffect(() => {
		if (typeof window !== "undefined") {
			const handleResize = () => {
				toggleSidebar(window.innerWidth < 960);
				toggleHidden(window.innerWidth < 768);
			};

			handleResize();
			window.addEventListener("resize", handleResize);

			return () => window.removeEventListener("resize", handleResize);
		}
	}, []);

	return (
		<div className="h-screen flex overflow-hidden">
			<Sidebar
				session={session}
				isPending={isPending}
				sidebarCollapsed={sidebarCollapsed}
				toggleSidebar={toggleSidebar}
			/>
			<div
				className={`w-full flex flex-col overflow-y-auto duration-200 ${
					sidebarCollapsed ? "pl-[80px]" : "pl-[285px]"
				} ${sidebarHidden ? "!pl-0" : ""}`}
			>
				<Navbar session={session} isPending={isPending} />
				<main className="overflow-y-auto h-full px-4 xss:px-5 sm:px-7 pt-6">
					{children}
				</main>
			</div>
		</div>
	);
}
