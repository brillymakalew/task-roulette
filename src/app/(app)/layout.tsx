import { NavigationShell } from '@/components/BottomNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-[100dvh] bg-slate-50 font-sans">
            <div className="w-full max-w-md mx-auto min-h-[100dvh] bg-white relative shadow-sm border-x border-slate-100 flex flex-col">
                <NavigationShell />
                <main className="pt-20 pb-24 px-4 flex-1">
                    {children}
                </main>
            </div>
        </div>
    )
}
