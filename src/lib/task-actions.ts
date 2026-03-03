'use server'

import { db } from '@/lib/db'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache'

async function getUserId() {
    const session = await auth()
    if (!session?.user?.id) throw new Error('Unauthorized')
    return parseInt(session.user.id, 10)
}

function getTodayString() {
    return new Date().toISOString().split('T')[0]
}

export async function bulkAddTasks(text: string) {
    const userId = await getUserId()
    const lines = text.split('\n')
        .map(t => t.trim())
        .filter(t => t.length > 0)

    if (lines.length === 0) return { error: 'No valid tasks found.' }

    await db.task.createMany({
        data: lines.map(title => ({
            user_id: userId,
            title,
            status: 'active'
        }))
    })

    revalidatePath('/today')
    revalidatePath('/active')
    return { success: true, count: lines.length }
}

export async function getActiveTasks() {
    const userId = await getUserId()
    return db.task.findMany({
        where: { user_id: userId, status: 'active' },
        orderBy: { created_at: 'desc' }
    })
}

export async function getArchivedTasks() {
    const userId = await getUserId()
    return db.task.findMany({
        where: { user_id: userId, status: 'archived' },
        orderBy: { completed_at: 'desc' }
    })
}

export async function getTodayArchivedTasks() {
    const userId = await getUserId()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return db.task.findMany({
        where: {
            user_id: userId,
            status: 'archived',
            completed_at: {
                gte: today
            }
        },
        orderBy: { completed_at: 'desc' }
    })
}

export async function getTodayState() {
    const userId = await getUserId()
    const dateKey = getTodayString()

    let state = await db.dailyTaskState.findUnique({
        where: { user_id_date_key: { user_id: userId, date_key: dateKey } },
        include: { current_task: true }
    })

    if (!state) {
        state = await db.dailyTaskState.create({
            data: { user_id: userId, date_key: dateKey, reroll_count: 0 },
            include: { current_task: true }
        })
    }

    // If current task is archived, clear it safely
    if (state.current_task && state.current_task.status === 'archived') {
        state = await db.dailyTaskState.update({
            where: { id: state.id },
            data: { current_task_id: null },
            include: { current_task: true }
        })
    }

    return state
}

export async function spinRoulette() {
    await getUserId() // require auth
    const state = await getTodayState()

    if (state.current_task) {
        return { error: 'You already have an active task for today.' }
    }

    const activeTasks = await getActiveTasks()
    if (activeTasks.length === 0) {
        return { error: 'No active tasks available. Please add some.' }
    }

    const randomTask = activeTasks[Math.floor(Math.random() * activeTasks.length)]
    return { task: randomTask }
}

export async function acceptTask(taskId: number) {
    const userId = await getUserId()
    const state = await getTodayState()

    if (state.current_task) {
        return { error: 'You already have an active task for today.' }
    }

    const task = await db.task.findUnique({ where: { id: taskId } })
    if (!task || task.user_id !== userId || task.status !== 'active') {
        return { error: 'Invalid task.' }
    }

    await db.dailyTaskState.update({
        where: { id: state.id },
        data: { current_task_id: taskId }
    })

    revalidatePath('/today')
    return { success: true }
}

export async function rerollTask(currentShownTaskId: number) {
    await getUserId()
    const state = await getTodayState()

    if (state.current_task) {
        return { error: 'You already accepted a task for today.' }
    }

    if (state.reroll_count >= 3) {
        return { error: 'No rerolls remaining today.' }
    }

    const activeTasks = await getActiveTasks()
    if (activeTasks.length === 0) {
        return { error: 'No active tasks available.' }
    }

    const eligibleTasks = activeTasks.filter(t => t.id !== currentShownTaskId)
    const pool = eligibleTasks.length > 0 ? eligibleTasks : activeTasks
    const randomTask = pool[Math.floor(Math.random() * pool.length)]

    await db.dailyTaskState.update({
        where: { id: state.id },
        data: { reroll_count: { increment: 1 } }
    })

    revalidatePath('/today')
    return { task: randomTask, remainingRerolls: 3 - (state.reroll_count + 1) }
}

export async function finishTask(taskId: number) {
    await getUserId()
    const state = await getTodayState()

    if (state.current_task?.id !== taskId) {
        return { error: 'This is not your accepted task for today.' }
    }

    await db.task.update({
        where: { id: taskId },
        data: { status: 'archived', completed_at: new Date() }
    })

    await db.dailyTaskState.update({
        where: { id: state.id },
        data: { current_task_id: null }
    })

    revalidatePath('/today')
    revalidatePath('/active')
    revalidatePath('/archive')
    return { success: true }
}
