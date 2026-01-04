import { useEffect, useState } from "react";

export function IsMobile(query = "(max-width: 640px)") {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);

    setIsMobile(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return isMobile;
}
