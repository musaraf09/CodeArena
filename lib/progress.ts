"use client";

import useSWR from "swr";

export type Progress = {
  bookmarks: string[];
  solved: string[];
  lessons: string[];
  activity: { date: string; problem: string }[];
  drafts: Record<string, string>;
};
const empty: Progress = {
  bookmarks: [],
  solved: [],
  lessons: [],
  activity: [],
  drafts: {},
};
const key = "codearena-progress-v1";
function read(): Progress {
  try {
    return { ...empty, ...JSON.parse(localStorage.getItem(key) || "{}") };
  } catch {
    return empty;
  }
}
export function useProgress() {
  const {
    data = empty,
    mutate,
    isLoading,
  } = useSWR<Progress>(key, read, {
    fallbackData: empty,
    revalidateOnFocus: true,
  });
  function update(fn: (current: Progress) => Progress) {
    const next = fn(read());
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* Keep the current session usable when browser storage is unavailable. */
    }
    void mutate(next, false);
  }
  return {
    progress: data,
    isLoading,
    bookmark: (id: string) =>
      update((p) => ({
        ...p,
        bookmarks: p.bookmarks.includes(id)
          ? p.bookmarks.filter((x) => x !== id)
          : [...p.bookmarks, id],
      })),
    solve: (id: string) =>
      update((p) => ({
        ...p,
        solved: [...new Set([...p.solved, id])],
        activity: [
          ...p.activity,
          { date: new Date().toISOString(), problem: id },
        ],
      })),
    completeLesson: (id: string) =>
      update((p) => ({ ...p, lessons: [...new Set([...p.lessons, id])] })),
    saveDraft: (id: string, code: string) =>
      update((p) => ({ ...p, drafts: { ...p.drafts, [id]: code } })),
  };
}
