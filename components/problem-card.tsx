'use client'

import Link from 'next/link'
import { ArrowUpRight, Bookmark, Check, Clock3 } from 'lucide-react'
import problems from '@/lib/problems.json'
import { useProgress } from '@/lib/progress'
export type Problem = typeof problems[number]
export function Difficulty({ value }: { value: string }) { return <span className={`difficulty ${value.toLowerCase()}`}><i />{value}</span> }
export function ProblemCard({ problem, index = 0 }: { problem: Problem; index?: number }) {
  const { progress, bookmark } = useProgress()
  const saved = progress.bookmarks.includes(problem.id)
  const solved = progress.solved.includes(problem.id)
  return <article className="problem-card"><div className="problem-card-top"><span className="problem-number">{String(index + 1).padStart(2, '0')} <span>/</span> {problem.category}</span><button className={`icon-button bookmark ${saved ? 'saved' : ''}`} aria-label={`${saved ? 'Remove bookmark for' : 'Bookmark'} ${problem.title}`} aria-pressed={saved} onClick={() => bookmark(problem.id)}><Bookmark size={17} fill={saved ? 'currentColor' : 'none'} /></button></div><Link href={`/problems/${problem.id}`} className="problem-card-title">{problem.title}<ArrowUpRight size={19} /></Link><p>{problem.description}</p><div className="tags">{problem.tags.map(t => <span key={t}>{t}</span>)}</div><div className="problem-card-bottom"><Difficulty value={problem.difficulty} /><span>{solved ? <><Check size={14} /> Solved</> : <><Clock3 size={13} /> {problem.minutes} min</>}</span><span>{problem.acceptance}% acceptance</span></div></article>
}
