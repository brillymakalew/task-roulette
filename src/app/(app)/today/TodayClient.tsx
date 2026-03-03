'use client'

import { useState, useEffect } from 'react'
import { spinRoulette, acceptTask, rerollTask, finishTask } from '@/lib/task-actions'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'

type Task = { id: number, title: string }
type State = {
    current_task: Task | null,
    reroll_count: number
}

export function TodayClient({ initialState, activeCount }: { initialState: State, activeCount: number }) {
    const [state, setState] = useState<State>(initialState)
    const [shownTask, setShownTask] = useState<Task | null>(null)
    const [isSpinning, setIsSpinning] = useState(false)
    const [loading, setLoading] = useState(false)
    const [currentIcon, setCurrentIcon] = useState('🎰')

    const remainingRerolls = 3 - state.reroll_count

    useEffect(() => {
        let interval: NodeJS.Timeout
        const icons = ['🎰', '🎲', '🎯', '⏱️', '🔥', '⚡', '🚀', '💡', '🏆', '📌', '✏️', '💻']
        if (isSpinning) {
            interval = setInterval(() => {
                setCurrentIcon(icons[Math.floor(Math.random() * icons.length)])
            }, 150)
        } else {
            setCurrentIcon('🎰')
        }
        return () => clearInterval(interval)
    }, [isSpinning])

    const triggerConfetti = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#4f46e5', '#9333ea', '#ec4899']
        })
    }

    const triggerRouletteParticles = () => {
        const defaults = {
            spread: 360,
            ticks: 50,
            gravity: 0,
            decay: 0.94,
            startVelocity: 30,
            colors: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8']
        };

        function shoot() {
            confetti({
                ...defaults,
                particleCount: 40,
                scalar: 1.2,
                shapes: ['star']
            });

            confetti({
                ...defaults,
                particleCount: 10,
                scalar: 0.75,
                shapes: ['circle']
            });
        }

        setTimeout(shoot, 0);
        setTimeout(shoot, 100);
        setTimeout(shoot, 200);
    }

    const handleSpin = async () => {
        setLoading(true)
        setIsSpinning(true)

        // Fake an animation delay for the physical "spin" effect
        setTimeout(async () => {
            const result = await spinRoulette()
            setIsSpinning(false)
            setLoading(false)
            if (result.error) return alert(result.error)
            if (result.task) {
                setShownTask(result.task)
                triggerRouletteParticles()
            }
        }, 3000) // Increased to 3s to let the animation play out
    }

    const handleReroll = async () => {
        if (!shownTask) return

        const currentTaskId = shownTask.id
        setLoading(true)
        setIsSpinning(true)
        setShownTask(null) // Reset view back to the main roulette wheel

        setTimeout(async () => {
            const result = await rerollTask(currentTaskId)
            setIsSpinning(false)
            setLoading(false)
            if (result.error) return alert(result.error)
            if (result.task) {
                setShownTask(result.task)
                triggerRouletteParticles()
                setState(s => ({ ...s, reroll_count: s.reroll_count + 1 }))
            }
        }, 3000)
    }

    const handleAccept = async () => {
        if (!shownTask) return
        setLoading(true)
        const result = await acceptTask(shownTask.id)
        setLoading(false)
        if (result.error) return alert(result.error)
        setState(s => ({ ...s, current_task: shownTask }))
        setShownTask(null)
    }

    const handleFinish = async () => {
        if (!state.current_task) return
        setLoading(true)
        const result = await finishTask(state.current_task.id)
        setLoading(false)
        if (result.error) return alert(result.error)

        triggerConfetti()
        setState(s => ({ ...s, current_task: null }))
    }

    // View States
    if (state.current_task) {
        return (
            <div className="flex flex-col items-center justify-center flex-1 space-y-8 mt-12">
                <div className="text-center space-y-2">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full">
                        Today's Mission
                    </span>
                </div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full bg-white p-8 rounded-3xl shadow-xl shadow-indigo-100 border border-indigo-50 flex items-center justify-center min-h-[200px]"
                >
                    <h1 className="text-2xl font-bold text-slate-800 text-center leading-relaxed">
                        {state.current_task.title}
                    </h1>
                </motion.div>

                <Button
                    onClick={handleFinish}
                    disabled={loading}
                    className="w-full py-7 text-lg font-bold rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-200 transition-all active:scale-95"
                >
                    {loading ? 'Completing...' : 'Mark as Finished 🎉'}
                </Button>
            </div>
        )
    }

    if (shownTask) {
        return (
            <div className="flex flex-col items-center justify-center flex-1 space-y-6 mt-8">
                <div className="text-center space-y-1">
                    <p className="text-sm font-semibold text-slate-500">The Roulette Has Spoken!</p>
                    <p className="text-xs text-slate-400">{remainingRerolls} rerolls left today</p>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={shownTask.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className={`w-full bg-white p-8 rounded-3xl shadow-xl border border-indigo-100 flex items-center justify-center min-h-[200px] ${isSpinning ? 'animate-pulse' : ''}`}
                    >
                        <h1 className="text-2xl font-bold text-slate-800 text-center leading-relaxed">
                            {isSpinning ? 'SPINNING...' : shownTask.title}
                        </h1>
                    </motion.div>
                </AnimatePresence>

                <div className="grid grid-cols-2 gap-4 w-full">
                    <Button
                        variant="outline"
                        onClick={handleReroll}
                        disabled={loading || isSpinning || remainingRerolls <= 0}
                        className="w-full py-6 text-base font-bold rounded-xl border-2 border-slate-200 hover:bg-slate-50 transition-all active:scale-[0.98]"
                    >
                        Reroll 🎲
                    </Button>
                    <Button
                        onClick={handleAccept}
                        disabled={loading || isSpinning}
                        className="w-full py-6 text-base font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all active:scale-[0.98]"
                    >
                        Accept ✓
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center flex-1 space-y-8 mt-16">
            <div className="w-48 h-48 bg-gradient-to-tr from-indigo-100 to-purple-50 rounded-full flex items-center justify-center shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-white/40 rounded-full animate-ping opacity-20" />
                <motion.div
                    className="w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center relative"
                    animate={
                        isSpinning
                            ? { rotate: [0, 360 * 10] } // Spin 10 times rapidly
                            : { rotate: 0 }
                    }
                    transition={{
                        duration: 3,
                        ease: "circOut", // physical slow down effect
                    }}
                >
                    <span className="text-5xl">{currentIcon}</span>
                    {/* Add visual notches to the wheel so spinning is obvious */}
                    <div className="absolute inset-0 rounded-full border-[12px] border-dashed border-indigo-100/50" />
                </motion.div>
            </div>

            <div className="text-center space-y-2">
                <h2 className="text-2xl font-black text-slate-800">Spin the Roulette</h2>
                <p className="text-slate-500 text-sm max-w-[250px] mx-auto">
                    Let fate decide your next priority. You can reroll up to 3 times a day.
                </p>
            </div>

            <Button
                onClick={handleSpin}
                disabled={loading || isSpinning || activeCount === 0}
                className="w-full max-w-[280px] py-7 text-xl font-black rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl shadow-indigo-200 transition-all active:scale-95"
            >
                {isSpinning ? 'Spinning...' : 'SPIN NOW'}
            </Button>

            {activeCount === 0 && (
                <p className="text-red-500 text-sm font-medium mt-2">You need to add tasks first!</p>
            )}
        </div>
    )
}
