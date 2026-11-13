'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Bookmark, Check, ChevronRight, Code2, FileText, Lightbulb, Play, RotateCcw, Send, Terminal } from 'lucide-react'
import problems from '@/lib/problems.json'
import { useProgress } from '@/lib/progress'
import { Difficulty, type Problem } from './problem-card'
const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false, loading: () => <div className="editor-loading">Loading editor…</div> })
type Result = { passed: boolean; actual: string; expected: string }
export function ProblemWorkspace({ problem }: { problem: Problem }) {
  const { progress, bookmark, solve, saveDraft, isLoading } = useProgress()
  const [code, setCode] = useState<string | null>(null)
  const [basicEditor, setBasicEditor] = useState(false)
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState<Result[] | null>(null)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [test, setTest] = useState(0)
  const worker = useRef<Worker | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const currentCode = code ?? progress.drafts[problem.id] ?? problem.starter
  useEffect(() => () => { worker.current?.terminate(); if (timer.current) clearTimeout(timer.current) }, [])
  function changeCode(value: string) { setCode(value); saveDraft(problem.id, value) }
  function run(submit: boolean) {
    worker.current?.terminate()
    setRunning(true); setResults(null); setError(''); setSubmitted(submit)
    saveDraft(problem.id, currentCode)
    const instance = new Worker('/runner-worker.js')
    worker.current = instance
    function finish() { instance.terminate(); setRunning(false); if (timer.current) clearTimeout(timer.current) }
    instance.onmessage = ({ data }: MessageEvent<{ error?: string; results?: Result[] }>) => { finish(); if (data.error) setError(data.error); else if (data.results) { setResults(data.results); if (submit && data.results.every(r => r.passed)) solve(problem.id) } }
    instance.onerror = () => { finish(); setError('The JavaScript runner could not start. Please try again.') }
    timer.current = setTimeout(() => { finish(); setError('Time limit exceeded (3 seconds). Check your code for an infinite loop.') }, 3000)
    instance.postMessage({ code: currentCode, functionName: problem.functionName, tests: problem.tests, unordered: problem.id === 'two-sum' })
  }
  const nextProblem = problems[(problems.findIndex(p => p.id === problem.id) + 1) % problems.length]
  const passed = results?.every(r => r.passed)
  return <main className="workspace-main"><div className="workspace-top"><Link href="/problems"><ArrowLeft size={13} /> Problem library</Link><ChevronRight size={12} /><span>{problem.title}</span><Link style={{ marginLeft: 'auto' }} href={`/problems/${nextProblem.id}`}>Next problem <ArrowRight size={13} /></Link></div><div className="workspace-columns"><section className="description-panel"><div className="panel-tabs"><span><FileText size={14} /> Description</span></div><div className="description-content"><h1>{problem.number}. {problem.title}</h1><div className="problem-meta"><Difficulty value={problem.difficulty} /><div className="tags">{problem.tags.map(t => <span key={t}>{t}</span>)}</div><button className={`icon-button bookmark ${progress.bookmarks.includes(problem.id) ? 'saved' : ''}`} onClick={() => bookmark(problem.id)} aria-label="Bookmark problem" aria-pressed={progress.bookmarks.includes(problem.id)}><Bookmark size={16} fill={progress.bookmarks.includes(problem.id) ? 'currentColor' : 'none'} /></button></div><p>{problem.description}</p>{problem.tests.slice(0,2).map((t,i) => <div key={i}><h3>Example {i+1}</h3><pre className="example-block">{'Input: ' + t.args.map(a => JSON.stringify(a)).join(', ') + '\nOutput: ' + JSON.stringify(t.expected)}</pre></div>)}<h3>Constraints</h3><ul className="constraints">{problem.constraints.map(c => <li key={c}>{c}</li>)}</ul><details className="hint"><summary><Lightbulb size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 7 }} /> Need a little nudge?</summary><p>{problem.hint}</p></details></div></section><div><section className="code-panel" aria-label="JavaScript code editor"><div className="code-panel-header"><span><Code2 size={15} className="purple" /> JavaScript <span className="muted">ES2022</span></span><button className="icon-button" onClick={() => { changeCode(problem.starter); setResults(null); setError('') }} aria-label="Reset code to starter"><RotateCcw size={13} /> Reset</button></div><div className="editor-note"><span>Runs locally in an isolated worker · JavaScript only</span><button onClick={() => setBasicEditor(!basicEditor)}>{basicEditor ? 'Use Monaco' : 'Use plain editor'}</button></div>{basicEditor ? <textarea className="code-fallback" aria-label="JavaScript solution" spellCheck={false} value={currentCode} onChange={e => changeCode(e.target.value)} /> : <Editor height="380px" language="javascript" theme="vs-dark" value={currentCode} onChange={v => changeCode(v ?? '')} loading={<div className="editor-loading">Loading Monaco… or use the plain editor above.</div>} beforeMount={monaco => monaco.editor.defineTheme('codearena', { base: 'vs-dark', inherit: true, rules: [{ token: 'comment', foreground: '626D8B' }, { token: 'keyword', foreground: 'B99AF5' }], colors: { 'editor.background': '#11141f', 'editorLineNumber.foreground': '#484D69', 'editor.foreground': '#D0D5ED', 'editor.lineHighlightBackground': '#191C2C', 'editorCursor.foreground': '#B497FF' } })} onMount={(_,monaco) => monaco.editor.setTheme('codearena')} options={{ fontFamily: 'var(--font-code), monospace', fontSize: 12, lineHeight: 23, padding: { top: 20 }, minimap: { enabled: false }, scrollBeyondLastLine: false, automaticLayout: true, tabSize: 2, wordWrap: 'on', overviewRulerLanes: 0, renderLineHighlight: 'line' }} />}<div className="code-actions"><span>{progress.solved.includes(problem.id) ? '✓ Previously solved' : 'Your progress, at your pace.'}</span><button className="button button-secondary" disabled={running || isLoading} onClick={() => run(false)}><Play size={12} />{running ? 'Running…' : 'Run code'}</button><button className="button button-primary" disabled={running || isLoading} onClick={() => run(true)}><Send size={12} /> Submit</button></div></section><section className="test-panel" aria-label="Test cases and results"><div className="panel-tabs"><span><Terminal size={14} /> Test cases & results</span></div><div className="test-content" aria-live="polite">{running ? <p className="muted">Executing your JavaScript…</p> : error ? <><div className="result-banner failed">Execution error</div><pre className="example-block">{error}</pre></> : results ? <><div className={`result-banner ${passed ? '' : 'failed'}`}>{passed ? (submitted ? 'Accepted. Nicely done!' : 'All tests passed. Ready to submit?') : 'Not quite yet. Keep going.'} <span>{results.filter(r => r.passed).length}/{results.length}</span></div>{results.map((r,i) => <div key={i} className="result-row"><span className={r.passed ? 'text-green' : 'hard'}>{r.passed ? '✓' : '×'} Case {i+1}</span>{!r.passed && <div>Expected: {r.expected}<br />Received: {r.actual}</div>}</div>)}{passed && submitted && <Link className="text-link" style={{ marginTop: 17 }} href="/dashboard">View your progress <ArrowRight size={12} /></Link>}</> : <><div className="test-case-tabs">{problem.tests.map((_,i) => <button key={i} className={test === i ? 'active' : ''} aria-pressed={test === i} onClick={() => setTest(i)}>Case {i+1}</button>)}</div><p className="test-label">Input</p><pre className="example-block">{problem.tests[test].args.map(a => JSON.stringify(a)).join(', ')}</pre><p className="test-label">Expected output</p><pre className="example-block">{JSON.stringify(problem.tests[test].expected)}</pre></>}</div></section></div></div></main>
}
