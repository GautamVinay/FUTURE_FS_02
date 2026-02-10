## Packages
framer-motion | Complex animations for page transitions and glassmorphism effects
recharts | Analytics charts for the dashboard
date-fns | Date formatting for timelines and tables
react-hook-form | Form state management
zod | Schema validation
@hookform/resolvers | Zod resolver for react-hook-form
lucide-react | Icons (already in stack, but noting usage)

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  display: ["'Outfit'", "sans-serif"],
  body: ["'DM Sans'", "sans-serif"],
}
Tailwind Config - extend colors:
colors: {
  brand: {
    DEFAULT: "hsl(354 80% 51%)", // Crimson Red #E61E32
    foreground: "hsl(0 0% 100%)",
    50: "hsl(354 100% 97%)",
    100: "hsl(354 100% 94%)",
    200: "hsl(354 90% 88%)",
    300: "hsl(354 85% 78%)",
    400: "hsl(354 80% 64%)",
    500: "hsl(354 80% 51%)", // Primary
    600: "hsl(354 75% 45%)",
    700: "hsl(354 70% 38%)",
    800: "hsl(354 65% 32%)",
    900: "hsl(354 60% 28%)",
  }
}
