"use client";

import { useEffect } from "react";
import { applyTheme, getTheme } from "@/lib/theme";

export default function ThemeInitializer() {
  useEffect(() => {
    applyTheme(getTheme());
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme(getTheme());
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return null;
}
