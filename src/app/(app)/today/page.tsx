import { getTodayState, getActiveTasks } from '@/lib/task-actions'
import { TodayClient } from './TodayClient'
import { auth } from '@/auth'

export default async function TodayPage() {
    const session = await auth()
    const activeTasks = await getActiveTasks()
    const todayState = await getTodayState()

    const safeState = {
        ...todayState,
        created_at: todayState.created_at.toISOString(),
        updated_at: todayState.updated_at.toISOString(),
        current_task: todayState.current_task ? {
            ...todayState.current_task,
            created_at: todayState.current_task.created_at.toISOString(),
            updated_at: todayState.current_task.updated_at.toISOString(),
            completed_at: todayState.current_task.completed_at?.toISOString() || null
        } : null
    }

    return (
        <div className="flex flex-col h-full space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Hi, {session?.user?.name || 'User'} 👋</h2>
                    <p className="text-sm text-slate-500 font-medium">Ready for action?</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-black text-indigo-600">{activeTasks.length}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tasks left</div>
                </div>
            </div>
            <TodayClient initialState={safeState} activeCount={activeTasks.length} />
        </div>
    )
}
