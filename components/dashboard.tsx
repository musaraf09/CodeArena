"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  CalendarDays,
  CheckCircle2,
  Code2,
  Flame,
  HardDrive,
  Trophy,
} from "lucide-react";
import problems from "@/lib/problems.json";
import { useProgress } from "@/lib/progress";
import { PageHeading } from "./site-shell";
import { ProblemCard } from "./problem-card";

export function Dashboard() {
  const { progress } = useProgress();
  const [tab, setTab] = useState<"solved" | "bookmarks">("solved");
  const solved = problems.filter((p) => progress.solved.includes(p.id));
  const visible = problems.filter((p) =>
    (tab === "solved" ? progress.solved : progress.bookmarks).includes(p.id),
  );
  const days = new Set(progress.activity.map((a) => a.date.slice(0, 10)));
  const today = new Date();
  let streak = 0;
  const day = new Date(today);
  if (!days.has(day.toISOString().slice(0, 10)))
    day.setUTCDate(day.getUTCDate() - 1);
  while (days.has(day.toISOString().slice(0, 10))) {
    streak++;
    day.setUTCDate(day.getUTCDate() - 1);
  }
  const activity = Array.from({ length: 140 }, (_, i) => {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - (139 - i));
    const key = d.toISOString().slice(0, 10);
    return {
      date: key,
      count: progress.activity.filter((a) => a.date.startsWith(key)).length,
    };
  });
  const stats = [
    {
      label: "Problems solved",
      value: solved.length,
      detail: `Out of ${problems.length} challenges`,
      icon: CheckCircle2,
    },
    {
      label: "Current streak",
      value: `${streak} ${streak === 1 ? "day" : "days"}`,
      detail: "A little consistency goes a long way",
      icon: Flame,
    },
    {
      label: "Lessons completed",
      value: progress.lessons.length,
      detail: "Out of 9 bite-sized lessons",
      icon: BookOpen,
    },
    {
      label: "Saved for later",
      value: progress.bookmarks.length,
      detail: "Your next opportunities to grow",
      icon: Bookmark,
    },
  ];
  return (
    <main className="page-container">
      <PageHeading
        eyebrow="EVERY SMALL WIN COUNTS"
        title="Look how far you’re going."
        description="Your effort adds up. Here’s a little perspective on your progress."
      />
      <div className="dashboard-stats">
        {stats.map(({ label, value, detail, icon: Icon }) => (
          <section className="dashboard-stat" key={label}>
            <div className="dashboard-stat-top">
              {label}
              <Icon size={17} />
            </div>
            <strong>{value}</strong>
            <p>{detail}</p>
          </section>
        ))}
      </div>
      <div className="dashboard-panels">
        <section className="dashboard-panel">
          <h2>Show up. Build momentum.</h2>
          <p>
            {progress.activity.length} accepted{" "}
            {progress.activity.length === 1 ? "submission" : "submissions"} over{" "}
            {days.size} active coding {days.size === 1 ? "day" : "days"}.
          </p>
          <div
            className="activity-grid"
            role="img"
            aria-label={`Coding activity over the last 140 days. ${days.size} active days.`}
          >
            {activity.map((a) => (
              <span
                key={a.date}
                className={`activity-day ${a.count > 0 ? "active" : ""}`}
                title={`${a.date}: ${a.count} accepted submissions`}
              />
            ))}
          </div>
          <div className="activity-legend">
            No activity <span /> <span /> Active
          </div>
        </section>
        <section className="dashboard-panel">
          <h2>One level at a time.</h2>
          <p>Your solved problems by difficulty.</p>
          {["Easy", "Medium", "Hard"].map((d) => {
            const total = problems.filter((p) => p.difficulty === d).length;
            const count = solved.filter((p) => p.difficulty === d).length;
            return (
              <div className={`progress-row ${d.toLowerCase()}`} key={d}>
                <div>
                  <span>{d}</span>
                  <span>
                    {count} <span className="muted">/ {total}</span>
                  </span>
                </div>
                <div
                  className="progress-track"
                  role="progressbar"
                  aria-label={`${d} problems solved`}
                  aria-valuenow={count}
                  aria-valuemin={0}
                  aria-valuemax={total}
                >
                  <span style={{ width: `${(count / total) * 100}%` }} />
                </div>
              </div>
            );
          })}
        </section>
      </div>
      <div className="dashboard-section-header">
        <h2>Your corner of the arena.</h2>
        <Link href="/problems" className="text-link">
          Find a challenge <ArrowRight size={14} />
        </Link>
      </div>
      <div className="dashboard-tabs" role="tablist" aria-label="Your problems">
        <button
          role="tab"
          aria-selected={tab === "solved"}
          aria-controls="dashboard-problems"
          id="solved-tab"
          className={tab === "solved" ? "active" : ""}
          onClick={() => setTab("solved")}
        >
          Solved problems ({solved.length})
        </button>
        <button
          role="tab"
          aria-selected={tab === "bookmarks"}
          aria-controls="dashboard-problems"
          id="bookmarks-tab"
          className={tab === "bookmarks" ? "active" : ""}
          onClick={() => setTab("bookmarks")}
        >
          Bookmarks ({progress.bookmarks.length})
        </button>
      </div>
      <div
        id="dashboard-problems"
        role="tabpanel"
        aria-labelledby={tab === "solved" ? "solved-tab" : "bookmarks-tab"}
      >
        {visible.length > 0 ? (
          <div className="featured-grid">
            {visible.map((p, i) => (
              <ProblemCard key={p.id} problem={p} index={i} />
            ))}
          </div>
        ) : (
          <div className="empty-state dashboard-empty">
            <Code2
              size={30}
              className="purple"
              style={{ margin: "0 auto 18px" }}
            />
            <h3>
              {tab === "solved"
                ? "Your first win is waiting."
                : "Keep your next challenge close."}
            </h3>
            <p>
              {tab === "solved"
                ? "Run your code, pass the tests, and submit your first solution."
                : "Bookmark a problem to find it here whenever you’re ready."}
            </p>
            <Link className="button button-primary" href="/problems">
              {tab === "solved"
                ? "Find your first challenge"
                : "Explore problems"}
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
      <p className="notice">
        <HardDrive size={13} /> Your progress lives in this browser. Clearing
        browser data will reset your progress and bookmarks.
      </p>
    </main>
  );
}
