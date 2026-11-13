"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Braces,
  CheckCircle2,
  Clock3,
  GitBranch,
  Layers3,
} from "lucide-react";
import courses from "@/lib/courses.json";
import { PageHeading } from "./site-shell";
import { useProgress } from "@/lib/progress";
export function Learn() {
  const { progress } = useProgress();
  const icons = [Braces, Layers3, GitBranch];
  return (
    <main className="page-container">
      <div className="learn-intro">
        <PageHeading
          eyebrow="A STRONG FOUNDATION CHANGES EVERYTHING"
          title="Your next chapter starts here."
          description="Less jargon. More lightbulb moments. Learn the fundamentals, then put them to work."
        />
        <span className="learn-count">
          {progress.lessons.length} / 9 lessons completed
        </span>
      </div>
      <div className="course-grid">
        {courses.map((course, i) => {
          const Icon = icons[i];
          const count = course.lessons.filter((l) =>
            progress.lessons.includes(`${course.id}/${l.id}`),
          ).length;
          return (
            <article key={course.id} className="course-card">
              <div className={`course-visual ${course.color}`}>
                <Icon size={45} strokeWidth={1} />
                <span className="course-code">{course.symbol}</span>
              </div>
              <div className="course-body">
                <div className="eyebrow">
                  0{i + 1} / {course.level}
                </div>
                <h2>{course.title}</h2>
                <p>{course.description}</p>
                <div className="course-meta">
                  <span>
                    <BookOpen size={12} /> {course.lessons.length} lessons
                  </span>
                  <span>
                    <Clock3 size={12} /> {course.minutes} min
                  </span>
                  <span className="text-green">
                    {count > 0 && `${count}/3 done`}
                  </span>
                </div>
                <div
                  className="progress-track purple"
                  aria-label={`${count} of 3 lessons complete`}
                >
                  <span style={{ width: `${(count / 3) * 100}%` }} />
                </div>
                <Link
                  className="button button-secondary"
                  href={`/learn/${course.id}`}
                >
                  {count === 3
                    ? "Revisit path"
                    : count > 0
                      ? "Continue learning"
                      : "Start learning"}
                  {count === 3 ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <ArrowRight size={14} />
                  )}
                </Link>
              </div>
            </article>
          );
        })}
      </div>
      <aside className="practice-callout">
        <BookOpen size={21} />
        <div>
          <h3>Learn it. Try it. Make it stick.</h3>
          <p>
            Every learning path connects to a real coding challenge. Knowledge
            becomes skill when you use it.
          </p>
        </div>
        <Link className="text-link" href="/problems">
          Explore the arena <ArrowRight size={14} />
        </Link>
      </aside>
      <p className="notice">
        Your learning progress is saved in this browser. No account needed.
      </p>
    </main>
  );
}
