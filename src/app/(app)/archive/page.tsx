import { getArchivedTasks } from '@/lib/task-actions'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

export default async function ArchivePage() {
    const tasks = await getArchivedTasks()

    return (
        <div className="space-y-6 pt-4">
            <div>
                <h2 className="text-2xl font-extrabold text-slate-800">Archive</h2>
                <p className="text-slate-500 text-sm mt-1">You have completed {tasks.length} tasks.</p>
            </div>

            {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-500 font-medium">Your archive is empty.</p>
                    <p className="text-slate-400 text-sm mt-1">Finish a task to see it here!</p>
                </div>
            ) : (
                <div className="space-y-3 pb-8">
                    {tasks.map(task => (
                        <Card key={task.id} className="overflow-hidden border-slate-200 shadow-sm bg-slate-50/50">
                            <CardContent className="p-4 flex items-start gap-3 opacity-70">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-slate-700 leading-snug line-through">{task.title}</p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        {task.completed_at ? new Date(task.completed_at).toLocaleDateString(undefined, {
                                            weekday: 'short', month: 'short', day: 'numeric'
                                        }) : 'Unknown date'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
