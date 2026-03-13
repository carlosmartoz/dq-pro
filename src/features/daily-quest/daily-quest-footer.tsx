import { CardFooter } from "@/components/ui/card"

export function DailyQuestFooter({ nextResetLabel }: { nextResetLabel: string }) {
  return (
    <CardFooter className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">
        Lists reset automatically every new day.
      </p>

      <p className="text-sm text-foreground">Next reset: {nextResetLabel}</p>
    </CardFooter>
  )
}

