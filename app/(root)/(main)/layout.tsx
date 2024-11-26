"use client";
import Navbar from "@/components/ui/navbar/Navbar";
import Sidebar from "@/components/ui/sidebar/Sidebar";
import { authClient } from "@/lib/auth-client";

export default function Layout({ children }: { children: React.ReactNode }) {
	const { data: session, isPending } = authClient.useSession();
	return (
		<main className="h-screen flex">
			<Sidebar session={session} isPending={isPending} />
			<div className="flex-1 mx-8">
				<Navbar session={session} isPending={isPending} />
				{children}
			</div>
		</main>
	);
}
