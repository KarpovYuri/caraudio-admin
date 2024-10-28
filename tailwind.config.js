/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				body: ['Plus Jakarta Sans'],
				sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
			},
			fontSize: {
				xs: [
					'20px',
					{
						lineHeight: '28px',
					},
				],
				s: [
					'24px',
					{
						lineHeight: '32px',
					},
				],
				m: [
					'28px',
					{
						lineHeight: '36px',
					},
				],
				l: [
					'32px',
					{
						lineHeight: '40px',
					},
				],
				xl: [
					'36px',
					{
						lineHeight: '44px',
					},
				],
				bodyS: [
					'12px',
					{
						lineHeight: '18px',
						letterSpacing: '0.15px',
					},
				],
				bodyM: [
					'14px',
					{
						lineHeight: '20px',
						letterSpacing: '0.15px',
					},
				],
				bodyL: [
					'16px',
					{
						lineHeight: '24px',
						letterSpacing: '0.15px',
					},
				],
				bodyXL: [
					'18px',
					{
						lineHeight: '28px',
						letterSpacing: '0.15px',
					},
				],
			},
			colors: {
				'noble-black': {
					100: '#e8e9e9',
					200: '#cdcecf',
					300: '#9b9c9e',
					400: '#686b6e',
					500: '#363a3d',
					600: '#1a1d21',
					700: '#131619',
					800: '#0d0f10',
					900: '#060708',
				},
				'day-blue': {
					100: '#ebedfc',
					200: '#d2d8f9',
					300: '#a6b0f2',
					400: '#7989ec',
					500: '#4d62e5',
					600: '#3045c9',
					700: '#243497',
					800: '#182364',
					900: '#0c1132',
				},
				'purple-blue': {
					100: '#f0e8fd',
					200: '#deccfb',
					300: '#bd9af8',
					400: '#9c67f4',
					500: '#7c35f1',
					600: '#5f18d4',
					700: '#47129f',
					800: '#300c6a',
					900: '#180635',
				},
				sunglow: {
					100: '#fffaea',
					200: '#fff3d1',
					300: '#ffe8a3',
					400: '#ffdc75',
					500: '#ffd147',
					600: '#e2b42b',
					700: '#aa8720',
					800: '#715a15',
					900: '#392d0b',
				},
				'stem-green': {
					100: '#f7fdf4',
					200: '#edfbe6',
					300: '#dbf7cd',
					400: '#c8f4b4',
					500: '#b6f09c',
					600: '#9ad37f',
					700: '#739f5f',
					800: '#4d6a3f',
					900: '#263520',
				},
				'heisenberg-blue': {
					100: '#f1fbfe',
					200: '#e0f6fd',
					300: '#c0edfb',
					400: '#a1e4f9',
					500: '#82dbf7',
					600: '#65beda',
					700: '#4c8fa4',
					800: '#335f6d',
					900: '#193037',
				},
				'happy-orange': {
					100: '#fff2e9',
					600: '#e26f20',
					900: '#391C08',
				},
				'electric-green': {
					100: '#f3fbf7',
					600: '#4ac97e',
					900: '#122b1d',
				},
				'red-power': {
					100: '#fbecec',
					600: '#d0302f',
					900: '#2f0f0e',
				},
			},
		},
	},
}
