import { useEffect, useMemo, useState } from "react"

function getMsUntilNextLocalMidnight(now: Date) {
  const next = new Date(now)

  next.setHours(24, 0, 0, 0)

  return Math.max(0, next.getTime() - now.getTime())
}

export function useNextResetCountdown() {
  const [msUntilReset, setMsUntilReset] = useState<number>(() =>
    getMsUntilNextLocalMidnight(new Date()),
  )

  useEffect(() => {
    const interval = window.setInterval(() => {
      setMsUntilReset(getMsUntilNextLocalMidnight(new Date()))
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

  return { nextResetLabel }
}

