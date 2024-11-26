import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import 'remixicon/fonts/remixicon.css';

const poppins = localFont({
	src: [
		{
			path: './fonts/poppins-v21-latin-900.woff2',
			weight: '900',
			style: 'normal',
		},
		{
			path: './fonts/poppins-v21-latin-800.woff2',
			weight: '800',
			style: 'normal',
		},
		{
			path: './fonts/poppins-v21-latin-700.woff2',
			weight: '700',
			style: 'normal',
		},
		{
			path: './fonts/poppins-v21-latin-600.woff2',
			weight: '600',
			style: 'normal',
		},
		{
			path: './fonts/poppins-v21-latin-500.woff2',
			weight: '500',
			style: 'normal',
		},
		{
			path: './fonts/poppins-v21-latin-regular.woff2',
			weight: '400',
			style: 'normal',
		},
		{
			path: './fonts/poppins-v21-latin-300.woff2',
			weight: '300',
			style: 'normal',
		},
		{
			path: './fonts/poppins-v21-latin-200.woff2',
			weight: '200',
			style: 'normal',
		},
		{
			path: './fonts/poppins-v21-latin-100.woff2',
			weight: '100',
			style: 'normal',
		},
	],
});

export const metadata: Metadata = {
	title: 'Oxcel',
	description: 'All In One Student Dashboard',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${poppins.className} antialiased bg-background`}>
				{children}
			</body>
		</html>
	);
}
