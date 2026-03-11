import { useEffect, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"

type Mission = {
  id: string
  title: string
  completed: boolean
}

const STORAGE_KEY = "daily-missions:v1"

function getTodayId() {
  return new Date().toISOString().slice(0, 10)
}

export function App() {
  const [{ missions, dayId }, setState] = useState(() => {
    const today = getTodayId()

    if (typeof window === "undefined") {
      return {
        dayId: today,
        missions: [] as Mission[],
      }
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) {
        return {
          dayId: today,
          missions: [] as Mission[],
        }
      }

      const parsed = JSON.parse(raw) as {
        dayId?: string
        missions?: Mission[]
      }

      if (!parsed || !Array.isArray(parsed.missions)) {
        return {
          dayId: today,
          missions: [] as Mission[],
        }
      }

      const baseMissions: Mission[] = parsed.missions.map((mission) => ({
        id: String(mission.id),
        title: String(mission.title),
        completed: Boolean(mission.completed),
      }))

      if (parsed.dayId === today) {
        return {
          dayId: today,
          missions: baseMissions,
        }
      }

      return {
        dayId: today,
        missions: baseMissions.map((mission) => ({
          ...mission,
          completed: false,
        })),
      }
    } catch {
      return {
        dayId: today,
        missions: [] as Mission[],
      }
    }
  })
  const [newTitle, setNewTitle] = useState("")

  useEffect(() => {
    const state = {
      dayId,
      missions,
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // storage might be unavailable; fail silently
    }
  }, [dayId, missions])

  const completedCount = useMemo(
    () => missions.filter((mission) => mission.completed).length,
    [missions],
  )

  const handleAddMission = () => {
    const title = newTitle.trim()
    if (!title) return

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    setState((prev) => ({
      ...prev,
      missions: [...prev.missions, { id, title, completed: false }],
    }))
    setNewTitle("")
  }

  const handleToggleMission = (id: string) => {
    setState((prev) => ({
      ...prev,
      missions: prev.missions.map((mission) =>
        mission.id === id
          ? {
              ...mission,
              completed: !mission.completed,
            }
          : mission,
      ),
    }))
  }

  const handleRemoveMission = (id: string) => {
    setState((prev) => ({
      ...prev,
      missions: prev.missions.filter((mission) => mission.id !== id),
    }))
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    handleAddMission()
  }

  const progressLabel =
    missions.length === 0
      ? "No missions yet"
      : `${completedCount} / ${missions.length} completed`

  const formattedDate = useMemo(() => {
    const date = new Date(dayId)
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }, [dayId])

  return (
    <div className="min-h-svh bg-background px-4 py-8 text-foreground">
      <div className="mx-auto flex max-w-md flex-col gap-5">
        <header className="space-y-1">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
            Daily dashboard
          </p>
          <div className="flex items-baseline justify-between gap-2">
            <h1 className="text-xl font-semibold">Daily Missions</h1>
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Define small, focused missions for today. They will reset automatically
            tomorrow.
          </p>
        </header>

        <main className="space-y-4 rounded-2xl border bg-card/60 p-4 shadow-sm backdrop-blur">
          <section className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium uppercase tracking-[0.16em]">
                Today&apos;s missions
              </span>
              <span>{progressLabel}</span>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex gap-2 rounded-xl border bg-background/40 px-3 py-2.5"
            >
              <input
                type="text"
                value={newTitle}
                onChange={(event) => setNewTitle(event.target.value)}
                placeholder="Add a mission for today"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                autoComplete="off"
              />
              <Button
                type="submit"
                size="sm"
                disabled={!newTitle.trim()}
                className="shrink-0"
              >
                Add
              </Button>
            </form>
          </section>

          <section className="space-y-2">
            {missions.length === 0 ? (
              <p className="rounded-xl border border-dashed bg-muted/40 px-3 py-3 text-xs text-muted-foreground">
                No missions yet. Start by adding 2–5 simple actions you want to
                complete today.
              </p>
            ) : (
              <ul className="space-y-1.5">
                {missions.map((mission) => (
                  <li
                    key={mission.id}
                    className="group flex items-center gap-3 rounded-xl border bg-background/60 px-3 py-2.5 text-sm transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleMission(mission.id)}
                      className="flex h-4 w-4 items-center justify-center rounded border border-input bg-background text-xs text-muted-foreground ring-offset-background transition hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      aria-pressed={mission.completed}
                    >
                      {mission.completed ? "✓" : ""}
                    </button>
                    <span
                      className={`flex-1 wrap-break-word ${
                        mission.completed ? "text-muted-foreground line-through" : ""
                      }`}
                    >
                      {mission.title}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMission(mission.id)}
                      className="h-7 w-7 text-xs text-muted-foreground hover:text-destructive"
                    >
                      ✕
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <footer className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
            <span>Lists reset automatically every new day.</span>
            <span className="hidden sm:inline">
              Press <kbd className="rounded bg-muted px-1 text-[10px]">d</kbd> to
              toggle dark mode.
            </span>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default App
