'use client'

import { useState } from 'react'
import { bulkAddTasks } from '@/lib/task-actions'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'

export default function AddTasksPage() {
    const [text, setText] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleImport = async () => {
        setLoading(true)
        const result = await bulkAddTasks(text)
        setLoading(false)
        if (result.error) {
            alert(result.error)
        } else {
            setText('')
            alert(`Successfully added ${result.count} tasks!`)
            router.push('/today')
        }
    }

    return (
        <div className="space-y-6 pt-4">
            <div>
                <h2 className="text-2xl font-extrabold text-slate-800">Add Tasks</h2>
                <p className="text-slate-500 text-sm mt-1">Paste multiple tasks separated by newlines.</p>
            </div>
            <Textarea
                className="min-h-[300px] text-base p-4 rounded-xl border-slate-200 focus-visible:ring-indigo-500 resize-none shadow-sm"
                placeholder={`Buy groceries\nCall mom\nFinish the report\n...`}
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <Button
                onClick={handleImport}
                disabled={loading || text.trim().length === 0}
                className="w-full py-6 text-base font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all active:scale-[0.98]"
            >
                {loading ? 'Importing...' : 'Import Tasks'}
            </Button>
        </div>
    )
}
