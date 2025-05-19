/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Adicionado para incluir a pasta src
  ],
  theme: {
    extend: {
      colors: {
        // Definindo cores personalizadas
        background: "#100F11", // Cor de fundo padrão
        foreground: "#FAFAFA", // Cor de texto padrão
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        light:
          "linear-gradient(to bottom, rgba(250, 250, 250, 0.6) 0%, rgba(255, 255, 255, 0.3) 100%)",
        dark: "linear-gradient(to bottom, rgba(250, 250, 250, 0.15), rgba(255, 255, 255, 0.05))",
      },
    },
  },
  plugins: [],
};
