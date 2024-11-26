import Image from 'next/image';
import Link from 'next/link';

export default function Layout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<>
			<header className="w-full">
				<nav className="flex items-center justify-between py-7 px-8 sm:px-12">
					<div className="flex items-center gap-2">
						<Image src="/logo.png" alt="Logo" width={24} height={24} />
						<span className="text-2xl font-semibold text-white">Oxcel</span>
					</div>
					<Link
						href="/auth/login"
						className="font-medium text-muted hover:text-white transition-colors"
					>
						Login
					</Link>
				</nav>
			</header>
			{children}
		</>
	);
}
