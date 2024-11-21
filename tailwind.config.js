/** @type {import('tailwindcss').Config} */
module.exports = {
  // reactStrictMode: false,
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens: {
        '3xs': '320px',   // Custom '3xs' breakpoint
        '2xs': '430px',    // Custom '2xs' breakpoint
        'xs': '480px',   // Custom 'xs' breakpoint
        'sm': '640px',   // Default 'sm' breakpoint
        'md': '768px',   // Default 'md' breakpoint
        'lg': '1024px',  // Default 'lg' breakpoint
        'xl': '1280px',  // Default 'xl' breakpoint
        '2xl': '1536px', // Default '2xl' breakpoint
      },
    },
  },
  plugins: [],
};  