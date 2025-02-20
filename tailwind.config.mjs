module.exports = {
	content: [
	  "./src/pages/**/*.{js,jsx}",
	  "./src/components/**/*.{js,jsx}",
	  "./src/app/**/*.{js,jsx}",
	],
	darkMode: ["class"],
	theme: {
	  extend: {
		colors: {
		  'accent': {
			400: '#4F46E5',  
			500: '#4338CA',
			600: '#3730A3',
		  },
		  'surface': {
			50: '#FAFAFA',
			100: '#F4F4F5',
			800: '#18181B',
			900: '#09090B',
			950: '#030303',
		  },
		  'success': '#10B981',
		  'error': '#EF4444',
		  'warning': '#F59E0B',
		},
		backgroundImage: {
		  'gradient-radial-dark': 'radial-gradient(circle at center, rgba(49, 46, 129, 0.06) 0%, rgba(0, 0, 0, 0) 70%)',
		  'gradient-dots': "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='rgba(255, 255, 255, 0.03)' /%3E%3C/svg%3E\")",
		},
		animation: {
		  'float': 'float 6s ease-in-out infinite',
		  'pulse-slow': 'pulse 3s ease-in-out infinite',
		  'glow': 'glow 2s ease-in-out infinite',
		  'slide-up': 'slideUp 0.3s ease-out',
		},
		keyframes: {
		  float: {
			'0%, 100%': { transform: 'translateY(0)' },
			'50%': { transform: 'translateY(-10px)' },
		  },
		  glow: {
			'0%, 100%': { opacity: 0.8 },
			'50%': { opacity: 1 },
		  },
		  slideUp: {
			'0%': { transform: 'translateY(10px)', opacity: 0 },
			'100%': { transform: 'translateY(0)', opacity: 1 },
		  },
		},
		boxShadow: {
		  'glow': '0 0 20px rgba(79, 70, 229, 0.15)',
		  'inner-light': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
		},
	  },
	},
	plugins: [
	  require("tailwindcss-animate")
	],
  };
  