/**
 * NEXT.JS — Home route (app/page.tsx → URL: /)
 * --------------------------------------------
 * Server Component by default (no "use client") — no useState/useEffect here.
 * This is just a landing page with links to the real vehicle screens.
 */
import Link from "next/link"; //Link is a client-side navigation component, it's not a server component., <a> is a server component.

export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Almosafer learning</h1>
      <p>
        {/* Link = client-side navigation (no full page reload) */}
        <Link href="/rides-lift">Lift state version</Link>
      </p>
      <p>
        {/* Folder app/rides/page.tsx maps to this href */}
        <Link href="/rides">MobX store version</Link>
      </p>
    </main>
  );
}
