"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  Bookmark,
  CheckCircle2,
  Search,
  Shuffle,
  Sparkles,
} from "lucide-react";
import problems from "@/lib/problems.json";
import { useProgress } from "@/lib/progress";
import { Difficulty } from "./problem-card";
import { PageHeading } from "./site-shell";

export function ProblemBrowser() {
  const params = useSearchParams();
  const category = params.get("category") || "All topics";
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("All difficulties");
  const [status, setStatus] = useState("All statuses");
  const [savedOnly, setSavedOnly] = useState(false);
  const { progress, bookmark } = useProgress();
  const filtered = problems.filter(
    (p) =>
      (category === "All topics" || p.category === category) &&
      (difficulty === "All difficulties" || p.difficulty === difficulty) &&
      (status === "All statuses" ||
        (status === "Solved"
          ? progress.solved.includes(p.id)
          : !progress.solved.includes(p.id))) &&
      (!savedOnly || progress.bookmarks.includes(p.id)) &&
      `${p.title} ${p.tags.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <main className="page-container">
      <PageHeading
        eyebrow="YOUR DAILY DOSE OF PROBLEM SOLVING"
        title="Small problems. Real growth."
        description="Find your next challenge. Think it through. Make it work."
      />
      <div className="toolbar">
        <label className="search-field">
          <Search size={16} />
          <span className="sr-only">Search problems</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search problems, topics, or patterns..."
          />
        </label>
        <select
          aria-label="Filter by difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          {["All difficulties", "Easy", "Medium", "Hard"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select
          aria-label="Filter by status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {["All statuses", "Solved", "Unsolved"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <label className="filter-check">
          <input
            type="checkbox"
            checked={savedOnly}
            onChange={(e) => setSavedOnly(e.target.checked)}
          />
          <Bookmark size={13} /> Bookmarked
        </label>
      </div>
      <nav className="topic-filters" aria-label="Filter by topic">
        {["All topics", ...new Set(problems.map((p) => p.category))].map(
          (c) => (
            <Link
              key={c}
              href={
                c === "All topics"
                  ? "/problems"
                  : `/problems?category=${encodeURIComponent(c)}`
              }
              className={category === c ? "active" : ""}
              aria-current={category === c ? "true" : undefined}
            >
              {c}
            </Link>
          ),
        )}
      </nav>
      <p className="results-count" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "problem" : "problems"} ·{" "}
        {progress.solved.length} solved
      </p>
      <div className="problem-table-wrap">
        <table className="problem-table">
          <thead>
            <tr>
              <th scope="col">Status</th>
              <th scope="col">Problem</th>
              <th scope="col">Difficulty</th>
              <th scope="col">Topics</th>
              <th scope="col">Acceptance</th>
              <th scope="col">
                <span className="sr-only">Bookmark</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>
                  {progress.solved.includes(p.id) ? (
                    <CheckCircle2
                      className="text-green"
                      size={17}
                      aria-label="Solved"
                    />
                  ) : (
                    <span className="status-empty" aria-label="Not solved" />
                  )}
                </td>
                <td>
                  <Link className="table-title" href={`/problems/${p.id}`}>
                    <span className="table-number">
                      {String(p.number).padStart(2, "0")}
                    </span>
                    {p.title}
                  </Link>
                </td>
                <td>
                  <Difficulty value={p.difficulty} />
                </td>
                <td>
                  <div className="tags">
                    {p.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </td>
                <td className="muted">{p.acceptance}%</td>
                <td>
                  <button
                    className={`icon-button bookmark ${progress.bookmarks.includes(p.id) ? "saved" : ""}`}
                    onClick={() => bookmark(p.id)}
                    aria-label={`Bookmark ${p.title}`}
                    aria-pressed={progress.bookmarks.includes(p.id)}
                  >
                    <Bookmark
                      size={16}
                      fill={
                        progress.bookmarks.includes(p.id)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty-state">
            <h3>No problems found</h3>
            <p>Try a different search or clear your filters.</p>
            <button
              className="button button-secondary"
              style={{ marginTop: 15 }}
              onClick={() => {
                setQuery("");
                setDifficulty("All difficulties");
                setStatus("All statuses");
                setSavedOnly(false);
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
      <aside className="practice-callout">
        <Sparkles size={21} />
        <div>
          <h3>Not sure where to start?</h3>
          <p>
            Two Sum is a classic for a reason. Build your confidence, one
            solution at a time.
          </p>
        </div>
        <Link className="button button-secondary" href="/problems/two-sum">
          Try Two Sum <ArrowRight size={14} />
        </Link>
      </aside>
    </main>
  );
}
