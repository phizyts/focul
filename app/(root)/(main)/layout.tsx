import Sidebar from '@/components/ui/sidebar/Sidebar'

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<main className="h-screen flex">
			<Sidebar />
			{children}
		</main>
	)
}
