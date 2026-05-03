"use client";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import { cn } from "@/lib/utils";

interface CountUpAnimProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  decimals?: number;
}

export function CountUpAnim({
  end,
  suffix = "",
  prefix = "",
  duration = 2.5,
  className,
  decimals = 0,
}: CountUpAnimProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.4 });
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (inView && !started) setStarted(true);
  }, [inView, started]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {started ? (
        <CountUp end={end} duration={duration} decimals={decimals} />
      ) : (
        "0"
      )}
      {suffix}
    </span>
  );
}
