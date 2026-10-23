import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EngThai AI Academy",
    short_name: "EngThai",
    description: "English for your world. ภาษาอังกฤษในแบบของคุณ",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f8f7fc",
    theme_color: "#7860c9",
    lang: "en",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
