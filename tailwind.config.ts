
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				// Sir Ole VVIP Brand Colors
				'vip-black': '#000000',
				'vip-gold': '#D4AF37',
				'vip-gold-light': '#F3E5AB', // Updated to your preferred color
				'vip-gold-dark': '#E1D39A', // Updated to your preferred hover color
				'vip-red': '#DC143C',
				'vip-shield-border': '#C9B037',
				
				// iOS 26 Inspired Colors
				'ios-blue': '#007AFF',
				'ios-orange': '#FF9500',
				'ios-green': '#4CD964',
				'ios-red': '#FF3B30',
				'ios-purple': '#5856D6',
				'ios-pink': '#FFD3E0',
				
				// Background & Glass Effects
				'bg-primary': '#000000',
				'bg-secondary': '#1a1a1a',
				'bg-tertiary': '#2a2a2a',
				
				// Neutrals
				'neutral-light': '#F7F7F7',
				'neutral-medium': '#D6CEC3',
				'neutral-dark': '#BDBEC2',
				
				// shadcn integration
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				serif: ['Playfair Display', 'Georgia', 'serif'],
				mono: ['JetBrains Mono', 'Monaco', 'monospace'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			backdropBlur: {
				xs: '2px',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'pulse-gold': {
					'0%, 100%': { boxShadow: '0 0 0 0 rgba(212, 175, 55, 0.7)' },
					'50%': { boxShadow: '0 0 0 20px rgba(212, 175, 55, 0)' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.6s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'pulse-gold': 'pulse-gold 3s infinite',
				'shimmer': 'shimmer 2s infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
