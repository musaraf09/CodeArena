'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, BookOpen, Code2, Flame, LayoutDashboard, Menu, Terminal, X } from 'lucide-react'
import { useState } from 'react'
import { useProgress } from '@/lib/progress'

const links = [{ href: '/', label: 'Overview', icon: LayoutDashboard }, { href: '/problems', label: 'Problems', icon: Code2 }, { href: '/learn', label: 'Learn', icon: BookOpen }, { href: '/dashboard', label: 'Dashboard', icon: Terminal }]
export function SiteHeader() {
  const path = usePathname()
  const [open, setOpen] = useState(false)
  const { progress } = useProgress()
  const days = new Set(progress.activity.map(a => a.date.slice(0, 10))).size
  return <header className="site-header"><div className="nav-inner"><Link className="brand" href="/" aria-label="CodeArena home"><span className="brand-symbol"><Code2 size={23} strokeWidth={2.8} /></span>Code<span className="brand-light">Arena</span><span className="beta-label">BETA</span></Link><nav className={open ? 'main-nav open' : 'main-nav'} aria-label="Main navigation">{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={(href === '/' ? path === '/' : path.startsWith(href)) ? 'page' : undefined}><Icon size={15} />{label}</Link>)}</nav><div className="nav-actions"><Link href="/dashboard" className="streak" title="Active coding days"><Flame size={17} /> {days}<span>day{days !== 1 ? 's' : ''}</span></Link><span className="nav-divider" /><Link href="/dashboard" className="avatar" aria-label="Your dashboard">Y<span /></Link><button className="icon-button mobile-menu" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open}>{open ? <X /> : <Menu />}</button></div></div></header>
}
export function SiteFooter() { return <footer className="site-footer"><Link href="/" className="footer-brand"><Code2 size={19} /> CodeArena<span>Build a little. Grow a lot.</span></Link><span>Made for the love of problem solving.</span><Link href="/learn">Keep learning <ArrowUpRight size={14} /></Link></footer> }
export function PageHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) { return <div className="page-heading"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div> }
