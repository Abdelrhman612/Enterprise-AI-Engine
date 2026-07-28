import { useEffect, useRef } from "react";

export function useAutoScroll(isBusy: boolean) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isBusy && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [isBusy]);

  return containerRef;
}
