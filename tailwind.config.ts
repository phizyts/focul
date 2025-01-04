import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				primary: "#1F1F1F",
				muted: "#727986",
				background: "#FFFFFF",
				border: "#DBDBDB",
			},
			screens: {
				xss: "390px",
				xs: "480px",
				sm: "640px",
				md: "768px",
				lg: "960px",
				xl: "1100px",
				xl2: "1265px",
				xl3: "1440px",
				xl4: "2000px",
			},
		},
	},
	plugins: [],
};
export default config;
