export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@prisma/nuxt", "@vueuse/nuxt"],
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
