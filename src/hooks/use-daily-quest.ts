import { getTodayId } from "@/lib/get-today-id"
import { STORAGE_KEY } from "@/consts/storage-key"
import { useEffect, useMemo, useState } from "react"
import type { DailyQuestState, Quest, StoredState } from "@/types/quests"

function loadInitialState(): DailyQuestState {
  const today = getTodayId()

  if (typeof window === "undefined") {
    return { dayId: today, quests: [] }
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)

    if (!raw) return { dayId: today, quests: [] }

    const parsed = JSON.parse(raw) as StoredState

    if (!parsed || !Array.isArray(parsed.quests))
      return { dayId: today, quests: [] }

    const baseQuests: Quest[] = parsed.quests.map((quest) => ({
      id: String(quest.id),
      title: String(quest.title),
      completed: Boolean(quest.completed),
    }))

    if (parsed.dayId === today) {
      return { dayId: today, quests: baseQuests }
    }

    return {
      dayId: today,
      quests: baseQuests.map((quest) => ({
        ...quest,
        completed: false,
      })),
    }
  } catch {
    return { dayId: today, quests: [] }
  }
}

export function useDailyQuest() {
  const [{ quests, dayId }, setState] = useState<DailyQuestState>(() =>
    loadInitialState()
  )

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ dayId, quests })
      )
    } catch {
      // storage might be unavailable; fail silently
    }
  }, [dayId, quests])

  const completedCount = useMemo(
    () => quests.filter((quest) => quest.completed).length,
    [quests]
  )

  const progressLabel = useMemo(() => {
    return quests.length === 0
      ? "No quests yet"
      : `${completedCount} / ${quests.length} completed`
  }, [completedCount, quests.length])

  const formattedDate = useMemo(() => {
    const date = new Date(dayId)

    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }, [dayId])

  const addQuest = (title: string) => {
    const trimmed = title.trim()

    if (!trimmed) return

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    setState((prev) => ({
      ...prev,
      quests: [...prev.quests, { id, title: trimmed, completed: false }],
    }))
  }

  const toggleQuest = (id: string) => {
    setState((prev) => ({
      ...prev,
      quests: prev.quests.map((quest) =>
        quest.id === id
          ? {
              ...quest,
              completed: !quest.completed,
            }
          : quest
      ),
    }))
  }

  const removeQuest = (id: string) => {
    setState((prev) => ({
      ...prev,
      quests: prev.quests.filter((quest) => quest.id !== id),
    }))
  }

  return {
    dayId,
    quests,
    addQuest,
    toggleQuest,
    removeQuest,
    progressLabel,
    formattedDate,
  }
}
