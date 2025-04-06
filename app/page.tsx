import { HomepageContent } from "@/components/homepage-content";
import Script from "next/script";

export default function Home() {
  // JSON-LD structured data for better SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "PomoClock - Pomodoro Timer",
    description:
      "Free online Pomodoro timer for effective study sessions. Boost productivity with customizable work/break intervals, task tracking, and focus management.",
    applicationCategory: "ProductivityApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    keywords:
      "pomodoro, pomodoro timer, pomodoro technique, pomodoro clock, pomodoro study",
    screenshot: "https://pomostudy.app/og-image.png",
    url: "https://pomostudy.app",
  };

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HomepageContent />
    </>
  );
}
