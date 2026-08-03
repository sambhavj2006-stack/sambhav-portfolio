"use client";

import { useContext } from "react";
import { PointerFieldContext, type PointerFieldValue } from "./PointerFieldContext";

/** Read the shared pointer field. Returns null outside the provider or when there's no real pointer (SSR, touch). */
export function useSurfaceField(): PointerFieldValue | null {
  return useContext(PointerFieldContext);
}
