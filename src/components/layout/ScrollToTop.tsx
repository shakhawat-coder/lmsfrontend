"use client";

import { useEffect } from "react";

export default function ScrollToTop() {
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      // Find the closest anchor tag from the click target
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // We only care about internal links
      const isInternal = href.startsWith("/") || href.startsWith(window.location.origin);
      if (!isInternal) return;

      try {
        const url = new URL(href, window.location.origin);
        const currentUrl = new URL(window.location.href);

        // If the path, search, and hash match the current URL, scroll to top
        if (
          url.pathname === currentUrl.pathname &&
          url.search === currentUrl.search &&
          url.hash === "" // Don't interfere with anchor links
        ) {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
      } catch (err) {
        // Ignore invalid URLs
      }
    };

    // Use capture phase to ensure we catch it early
    document.addEventListener("click", handleAnchorClick, { capture: true });
    return () => document.removeEventListener("click", handleAnchorClick, { capture: true });
  }, []);

  return null;
}
