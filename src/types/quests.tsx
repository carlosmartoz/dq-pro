export type Quest = {
  id: string
  title: string
  completed: boolean
}

export type StoredState = {
  dayId?: string
  quests?: Quest[]
}

export type DailyQuestState = {
  dayId: string
  quests: Quest[]
}
