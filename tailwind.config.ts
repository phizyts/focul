import type { Config } from 'tailwindcss'

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				primary: '#2CAFE4',
				muted: '#A4A4A4',
				text: '#FFFFFF',
				background: '#1A1D1F',
				border: '#3B4245',
			},
		},
	},
	plugins: [],
}
export default config
