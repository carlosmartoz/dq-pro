import { useDailyQuest } from "@/hooks/use-daily-quest"
import { Card, CardContent } from "@/components/ui/card"
import { useNextResetCountdown } from "@/hooks/use-next-reset-countdown"
import { DailyQuestList } from "@/features/daily-quest/daily-quest-list"
import { DailyQuestForm } from "@/features/daily-quest/daily-quest-form"
import { DailyQuestHeader } from "@/features/daily-quest/daily-quest-header"
import { DailyQuestFooter } from "@/features/daily-quest/daily-quest-footer"

export function DailyQuestClient() {
  const {
    quests,
    addQuest,
    toggleQuest,
    removeQuest,
    formattedDate,
    progressLabel,
  } = useDailyQuest()

  const { nextResetLabel } = useNextResetCountdown()

  return (
    <Card className="mx-auto w-full max-w-md gap-6">
      <DailyQuestHeader formattedDate={formattedDate} />

      <CardContent className="m-0 flex flex-col gap-3">
        <DailyQuestForm onAdd={addQuest} />

        <DailyQuestList
          quests={quests}
          progressLabel={progressLabel}
          onToggle={toggleQuest}
          onRemove={removeQuest}
        />
      </CardContent>

      <DailyQuestFooter nextResetLabel={nextResetLabel} />
    </Card>
  )
}
