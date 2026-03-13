import {
  Card,
  CardTitle,
  CardFooter,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
import type { Quest } from "@/types/quest"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getTodayId } from "@/lib/get-today-id"
import { STORAGE_KEY } from "@/consts/storage-key"
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useMemo, useState } from "react"
import { Field, FieldGroup } from "@/components/ui/field"
import { ButtonGroup } from "@/components/ui/button-group"
import { Trash2 } from "lucide-react"

export function App() {
  const [{ quests, dayId }, setState] = useState(() => {
    const today = getTodayId()

    if (typeof window === "undefined") {
      return {
        dayId: today,
        quests: [] as Quest[],
      }
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)

      if (!raw) {
        return {
          dayId: today,
          quests: [] as Quest[],
        }
      }

      const parsed = JSON.parse(raw) as {
        dayId?: string
        quests?: Quest[]
      }

      if (!parsed || !Array.isArray(parsed.quests)) {
        return {
          dayId: today,
          quests: [] as Quest[],
        }
      }

      const baseQuests: Quest[] = parsed.quests.map((quest) => ({
        id: String(quest.id),
        title: String(quest.title),
        completed: Boolean(quest.completed),
      }))

      if (parsed.dayId === today) {
        return {
          dayId: today,
          quests: baseQuests,
        }
      }

      return {
        dayId: today,
        quests: baseQuests.map((quest) => ({
          ...quest,
          completed: false,
        })),
      }
    } catch {
      return {
        dayId: today,
        quests: [] as Quest[],
      }
    }
  })

  const [newTitle, setNewTitle] = useState("")

  useEffect(() => {
    const state = {
      dayId,
      quests,
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // storage might be unavailable; fail silently
    }
  }, [dayId, quests])

  const completedCount = useMemo(
    () => quests.filter((quest) => quest.completed).length,
    [quests]
  )

  const handleAddMission = () => {
    const title = newTitle.trim()

    if (!title) return

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    setState((prev) => ({
      ...prev,
      quests: [...prev.quests, { id, title, completed: false }],
    }))

    setNewTitle("")
  }

  const handleToggleMission = (id: string) => {
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

  const handleRemoveMission = (id: string) => {
    setState((prev) => ({
      ...prev,
      quests: prev.quests.filter((quest) => quest.id !== id),
    }))
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    handleAddMission()
  }

  const progressLabel =
    quests.length === 0
      ? "No quests yet"
      : `${completedCount} / ${quests.length} completed`

  const [msUntilReset, setMsUntilReset] = useState<number>(() => {
    const now = new Date()

    const next = new Date(now)

    next.setHours(24, 0, 0, 0)

    return Math.max(0, next.getTime() - now.getTime())
  })

  useEffect(() => {
    const interval = window.setInterval(() => {
      const now = new Date()

      const next = new Date(now)

      next.setHours(24, 0, 0, 0)

      setMsUntilReset(Math.max(0, next.getTime() - now.getTime()))
    }, 1000)

    return () => window.clearInterval(interval)
  }, [])

  const nextResetLabel = useMemo(() => {
    const totalSeconds = Math.floor(msUntilReset / 1000)

    const hours = Math.floor(totalSeconds / 3600)

    const minutes = Math.floor((totalSeconds % 3600) / 60)

    const seconds = totalSeconds % 60

    const pad2 = (value: number) => String(value).padStart(2, "0")

    return `${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`
  }, [msUntilReset])

  const formattedDate = useMemo(() => {
    const date = new Date(dayId)

    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }, [dayId])

  return (
    <div className="min-h-svh bg-background px-4 py-8">
      <Card className="mx-auto w-full max-w-md gap-6">
        <CardHeader className="m-0 flex flex-col gap-3">
          <div className="flex w-full items-baseline justify-between gap-2">
            <CardTitle className="text-xl font-bold">Daily Quest</CardTitle>

            <CardDescription className="text-sm">
              {formattedDate}
            </CardDescription>
          </div>

          <form onSubmit={handleSubmit} className="w-full">
            <FieldGroup>
              <Field>
                <ButtonGroup>
                  <Input
                    required
                    value={newTitle}
                    autoComplete="off"
                    id="input-button-group"
                    placeholder="Add a quest for today"
                    className="text-sm! placeholder:text-sm"
                    onChange={(event) => setNewTitle(event.target.value)}
                  />

                  <Button
                    type="submit"
                    variant="outline"
                    className="cursor-pointer text-sm transition-all duration-300"
                  >
                    Add
                  </Button>
                </ButtonGroup>
              </Field>
            </FieldGroup>
          </form>
        </CardHeader>

        <CardContent className="m-0">
          <div className="flex flex-col gap-2">
            <p className="text-base text-foreground">{progressLabel}</p>

            {quests.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Start by adding 2–5 simple actions you want to complete today.
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {quests.map((quest) => (
                  <li
                    key={quest.id}
                    className="flex h-10 items-center gap-4 border border-input bg-input/30 px-2"
                  >
                    <Checkbox
                      checked={quest.completed}
                      id={`row-${quest.id}-checkbox`}
                      name={`row-${quest.id}-checkbox`}
                      onCheckedChange={() => handleToggleMission(quest.id)}
                    />

                    <p
                      className={`flex-1 text-sm transition-all duration-300 ${
                        quest.completed
                          ? "text-muted-foreground line-through"
                          : "text-foreground"
                      }`}
                    >
                      {quest.title}
                    </p>

                    <Button
                      size="icon"
                      type="button"
                      variant="ghost"
                      onClick={() => handleRemoveMission(quest.id)}
                      className="w-auto cursor-pointer p-0 text-foreground transition-all duration-300 hover:text-destructive"
                    >
                      <Trash2 />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Lists reset automatically every new day.
          </p>

          <p className="text-sm text-foreground">
            Next reset: {nextResetLabel}
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default App
