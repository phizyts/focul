import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
