import type { MetadataRoute } from "next";

// Lets the app be added to the home screen and open full-screen like a native app.
// Colours are the dark `bg` token: the app is checked a lot at night.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MSplusEverythingIwant",
    short_name: "Us",
    description: "How far apart we are, and how we're feeling.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#17121c",
    theme_color: "#17121c",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
