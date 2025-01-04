import Image from "next/image";

export default function Layout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<>
			<div className="flex w-full h-screen justify-between">
				<Image
					src="/authbg.png"
					alt="Logo"
					width={0}
					height={0}
					sizes="100%"
					className="w-full h-full object-cover hidden xl:block"
				/>
				{children}
			</div>
		</>
	);
}
