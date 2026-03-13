import "@/styles/main.css"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { DailyQuestClient } from "@/features/daily-quest/daily-quest-client"


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <DailyQuestClient />
    </ThemeProvider>
  </StrictMode>
)
