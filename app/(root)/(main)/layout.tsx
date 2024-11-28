"use client";
import Navbar from "@/components/ui/navbar/Navbar";
import Sidebar from "@/components/ui/sidebar/Sidebar";
import { authClient } from "@/lib/auth-client";

export default function Layout({ children }: { children: React.ReactNode }) {
	const { data: session, isPending } = authClient.useSession();
	return (
		<div className="h-screen flex overflow-hidden">
			<Sidebar session={session} isPending={isPending} />
			<div className="flex-1 mx-8 flex flex-col overflow-y-auto">
				<Navbar session={session} isPending={isPending} />
				<main className="flex-1 mb-8 overflow-y-auto">{children}</main>
			</div>
		</div>
	);
}
