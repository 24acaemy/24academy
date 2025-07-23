import type { Config } from "tailwindcss";

// Ensure you're importing your custom properties if needed
// For example, ensure these variables are defined somewhere in your CSS
// :root {
//   --border: #ddd;
//   --input: #f4f4f4;
//   --primary: #0070f3;
//   ...
// }

const config: Config = {
  darkMode: ["class"],  // Enables dark mode with the class `dark`
  content: [
    "./pages/**/*.{ts,tsx}",     // Ensure all pages are being scanned
    "./components/**/*.{ts,tsx}", // Ensure all components are being scanned
    "./app/**/*.{ts,tsx}",        // If you're using app directory in Next 13+
    "./src/**/*.{ts,tsx}",        // If you have a src folder for components
  ],
  prefix: "", // Optional: Add a prefix to all Tailwind classes if needed
  theme: {
    container: {
      center: true, // Centers the container
      padding: "2rem", // Adds padding around the container
      screens: {
        '2xl': '1400px', // Custom screen size for 2xl
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))", 
        input: "hsl(var(--input))", 
        ring: "hsl(var(--ring))", 
        background: "hsl(var(--background))", 
        foreground: "hsl(var(--foreground))", 
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        academy: {
          navy: "hsl(var(--academy-navy))",
          silver: "hsl(var(--academy-silver))",
          light: "hsl(var(--academy-light))",
        },
      },
      backgroundImage: {
        "academy-gradient": "var(--academy-gradient)", // Custom gradient
      },
      boxShadow: {
        "academy-glow": "var(--academy-glow)", // Custom glow shadow
      },
      textShadow: {
        academy: "var(--academy-text-shadow)", // Custom text shadow
      },
      borderRadius: {
        lg: "var(--radius)", // Custom radius for large elements
        md: "calc(var(--radius) - 2px)", // Medium with small adjustment
        sm: "calc(var(--radius) - 4px)", // Small with adjustment
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(40px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.6s ease-out",
        "slide-up": "slide-up 0.8s ease-out",
        "scale-in": "scale-in 0.4s ease-out",
        float: "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")], // Ensure the animate plugin is installed
};

export default config;
