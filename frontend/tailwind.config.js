/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                canvas: '#FFFCF6',
                surface: '#FFFFFF',
                ink: {
                    DEFAULT: '#2B2420',
                    soft: '#746657',
                },
                coral: {
                    DEFAULT: '#FF6B4D',
                    deep: '#E24F2C',
                },
                sky: '#7FC4D6',
                butter: '#FFC857',
                sage: '#A9C08C',
                line: '#E9DFCC',
            },
            fontFamily: {
                display: ['Fredoka', 'ui-rounded', 'sans-serif'],
                body: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', '"Malgun Gothic"', 'sans-serif'],
            },
        },
    },
    plugins: [],
}