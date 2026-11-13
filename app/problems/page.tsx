import { Suspense } from 'react'
import { ProblemBrowser } from '@/components/problem-browser'
export const metadata = { title: 'Coding Problems' }
export default function Page() { return <Suspense fallback={<main className="page-container">Loading challenges...</main>}><ProblemBrowser /></Suspense> }
