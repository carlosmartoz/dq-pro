import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function DailyQuestHeader({ formattedDate }: { formattedDate: string }) {
  return (
    <CardHeader className="m-0 flex flex-col gap-3">
      <div className="flex w-full items-baseline justify-between gap-2">
        <CardTitle className="text-xl font-bold">Daily Quest</CardTitle>

        <CardDescription className="text-sm">{formattedDate}</CardDescription>
      </div>
    </CardHeader>
  )
}

