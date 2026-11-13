import Link from "next/link";
export default function NotFound() {
  return (
    <main className="not-found">
      <div
        className="eyebrow"
        style={{ justifyContent: "center", marginBottom: 20 }}
      >
        404 · UNEXPECTED DETOUR
      </div>
      <h1>Let&apos;s get you back on track.</h1>
      <p>This page is missing, but your next challenge isn&apos;t.</p>
      <Link className="button button-primary" href="/problems">
        Explore problems
      </Link>
    </main>
  );
}
