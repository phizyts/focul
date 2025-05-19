import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	async redirects() {
		return [
			{
				source: "/",
				destination: "/dashboard",
				permanent: true,
			},
			{
				source: "/courses",
				destination: "/courses/my",
				permanent: true,
			},
			{
				source: "/tasks",
				destination: "/tasks/upcoming",
				permanent: true,
			},
		];
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "copper-obvious-ptarmigan-243.mypinata.cloud",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
				pathname: "**",
			},
		],
	},
	experimental: {
		serverActions: {
			bodySizeLimit: "10mb",
		},
	},
};

export default nextConfig;
