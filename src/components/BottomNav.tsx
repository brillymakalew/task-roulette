'use client'

import { Home, List, PlusCircle, Archive, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logOut } from '@/lib/actions'
import { Button } from '@/components/ui/button'

export function NavigationShell() {
    const pathname = usePathname()

    const navItems = [
        { name: 'Today', href: '/today', icon: Home },
        { name: 'Add', href: '/add', icon: PlusCircle },
        { name: 'Active', href: '/active', icon: List },
        { name: 'Archive', href: '/archive', icon: Archive },
    ]

    return (
        <>
            <div className="fixed top-0 w-full max-w-md mx-auto left-0 right-0 p-4 flex justify-between items-center bg-white/90 backdrop-blur-md border-b z-40">
                <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                    Task Roulette <span className="text-lg">🎰</span>
                </h1>
                <form action={logOut}>
                    <Button variant="ghost" size="sm" type="submit" className="text-slate-500 hover:text-slate-800 flex items-center gap-1 h-8 px-2">
                        <LogOut size={16} /> <span className="sr-only">Logout</span>
                    </Button>
                </form>
            </div>

            <div className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 px-6 py-2 flex justify-between items-center z-40 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${isActive ? 'text-indigo-600 scale-110' : 'text-slate-400 hover:text-indigo-400'}`}
                        >
                            <item.icon size={22} className={isActive ? 'fill-indigo-100/50 stroke-[2.5px]' : 'stroke-2'} />
                            <span className="text-[10px] font-semibold mt-1">{item.name}</span>
                        </Link>
                    )
                })}
            </div>
        </>
    )
}
