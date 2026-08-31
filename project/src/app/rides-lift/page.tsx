/**
 * NEXT.JS — Route file (app/rides-lift/page.tsx → URL: /rides-lift)
 * -----------------------------------------------------------------
 * Thin route: folder name = URL segment. page.tsx makes the route public.
 * No "use client" needed — this file only imports and renders a client component.
 * The interactive UI lives in RidesResultsPage ("use client" + hooks).
 */
import RidesResultsPage from "@/components/RidesResultsPage";

export default function RidesLiftPage() {
  return <RidesResultsPage />;
}
