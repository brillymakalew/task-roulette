import { getActiveTasks, getTodayArchivedTasks } from '@/lib/task-actions'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

export default async function ActiveTasksPage() {
    const [tasks, completedTasks] = await Promise.all([
        getActiveTasks(),
        getTodayArchivedTasks()
    ])

    return (
        <div className="space-y-6 pt-4">
            <div>
                <h2 className="text-2xl font-extrabold text-slate-800">Active Tasks</h2>
                <p className="text-slate-500 text-sm mt-1">You have {tasks.length} tasks in your pool, and {completedTasks.length} finished today.</p>
            </div>

            {tasks.length === 0 && completedTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-500 font-medium">No active tasks found.</p>
                    <p className="text-slate-400 text-sm mt-1">Go to Add tab to import tasks!</p>
                </div>
            ) : (
                <div className="space-y-3 pb-8">
                    {/* Render completed tasks first */}
                    {completedTasks.map(task => (
                        <Card key={task.id} className="overflow-hidden border-emerald-200 bg-emerald-50/50 shadow-sm">
                            <CardContent className="p-4 flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 mt-0.5 text-emerald-500 flex-shrink-0" />
                                <p className="text-emerald-700 font-medium leading-snug line-through opacity-80">{task.title}</p>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Render active tasks */}
                    {tasks.map(task => (
                        <Card key={task.id} className="overflow-hidden border-slate-200 shadow-sm">
                            <CardContent className="p-4 flex items-start gap-3">
                                <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500 flex-shrink-0" />
                                <p className="text-slate-700 leading-snug">{task.title}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
