import type { ReactNode } from "react";

/**
 * Pass-through root. The real <html> element lives in `app/[locale]/layout.tsx`
 * so that `lang` and `dir` can be set from the active locale.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
