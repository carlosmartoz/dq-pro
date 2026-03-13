import { Trash2 } from "lucide-react"
import type { Quest } from "@/types/quests"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export function DailyQuestList({
  quests,
  onToggle,
  onRemove,
  progressLabel,
}: {
  quests: Quest[]
  progressLabel: string
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}) {
  return (
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
                onCheckedChange={() => onToggle(quest.id)}
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
                onClick={() => onRemove(quest.id)}
                className="w-auto cursor-pointer p-0 text-foreground transition-all duration-300 hover:text-destructive"
              >
                <Trash2 />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

